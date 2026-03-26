const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  monthly: { amount: 999, interval: 'month' }, // ₹999 in paise
  yearly: { amount: 9999, interval: 'year' },  // ₹9999 in paise
};

// @POST /api/subscriptions/checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    const { plan } = req.body;
    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const planConfig = PLANS[plan];
    const charityContrib = (planConfig.amount / 100) * (user.charityPercentage || 50) / 100;
    const prizeContrib = (planConfig.amount / 100) * 0.5;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: user._id.toString(),
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription?status=cancelled`,
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          plan: plan,
          charityContribution: charityContrib.toFixed(2),
          prizePoolContribution: prizeContrib.toFixed(2),
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Golf Charity ${plan === 'yearly' ? 'Yearly' : 'Monthly'} Plan`,
              description: `${charityContrib.toFixed(2)} to charity, ${prizeContrib.toFixed(2)} to prize pool`,
            },
            unit_amount: planConfig.amount,
            recurring: {
              interval: planConfig.interval,
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/subscriptions/webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Webhook secret not configured');
    return res.status(500).json({ message: 'Webhook not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionEvent(event.data.object, 'active');
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event.data.object, 'cancelled');
        break;

      case 'invoice.payment_succeeded':
        const subscription = event.data.object;
        if (subscription.subscription) {
          await handleSubscriptionEvent(
            await stripe.subscriptions.retrieve(subscription.subscription),
            'active'
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ message: err.message });
  }
};

const handleSubscriptionEvent = async (stripeSubscription, status) => {
  try {
    const clientRefId = stripeSubscription.metadata?.userId || stripeSubscription.client_reference_id;
    if (!clientRefId) return;

    const user = await User.findById(clientRefId);
    if (!user) return;

    const metadata = stripeSubscription.metadata || {};
    const planName = metadata.plan || 'monthly';

    const charityContrib = metadata.charityContribution ? parseFloat(metadata.charityContribution) : 0;
    const prizeContrib = metadata.prizePoolContribution ? parseFloat(metadata.prizePoolContribution) : 0;
    const amount = (PLANS[planName]?.amount || 999) / 100;

    // Upsert subscription in DB
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: stripeSubscription.id },
      {
        user: user._id,
        plan: planName,
        status: status,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer,
        amount,
        charityContribution: charityContrib || amount * 0.5,
        prizePoolContribution: prizeContrib || amount * 0.5,
        renewalDate: new Date(stripeSubscription.current_period_end * 1000),
      },
      { upsert: true, new: true }
    );

    // Update user
    user.stripeCustomerId = stripeSubscription.customer;
    user.stripeSubscriptionId = stripeSubscription.id;
    user.isSubscribed = status === 'active';
    user.subscriptionPlan = planName;
    user.subscriptionExpiry = new Date(stripeSubscription.current_period_end * 1000);

    if (status === 'cancelled') {
      user.stripeSubscriptionId = null;
      user.subscriptionPlan = null;
      user.isSubscribed = false;
    }

    await user.save();
  } catch (err) {
    console.error('Error handling subscription event:', err);
  }
};

// @POST /api/subscriptions/cancel
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription' });
    }

    await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    
    user.isSubscribed = false;
    user.subscriptionPlan = null;
    user.stripeSubscriptionId = null;
    await user.save();

    await Subscription.findOneAndUpdate(
      { user: user._id, status: 'active' },
      { status: 'cancelled' }
    );

    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/subscriptions/status
const getSubscriptionStatus = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    res.json(sub || { status: 'none' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  cancelSubscription,
  getSubscriptionStatus,
};