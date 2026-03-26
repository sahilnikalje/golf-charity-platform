const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  monthly: { amount: 1000, interval: 'month' }, // £10 in pence
  yearly: { amount: 10000, interval: 'year' },  // £100 in pence
};

// @POST /api/subscriptions/create
const createSubscription = async (req, res) => {
  try {
    const { plan, paymentMethodId } = req.body;
    const user = await User.findById(req.user._id);

    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      user.stripeCustomerId = customer.id;
    }

    const priceData = {
      currency: 'gbp',
      unit_amount: PLANS[plan].amount,
      recurring: { interval: PLANS[plan].interval },
      product_data: { name: `Golf Charity - ${plan} Plan` },
    };

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price_data: priceData }],
      expand: ['latest_invoice.payment_intent'],
    });

    const amount = PLANS[plan].amount / 100;
    const charityContrib = amount * (user.charityPercentage / 100);
    const prizeContrib = amount * 0.5;

    await Subscription.create({
      user: user._id, plan, status: 'active',
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customer.id,
      amount, charityContribution: charityContrib,
      prizePoolContribution: prizeContrib,
      renewalDate: new Date(subscription.current_period_end * 1000),
    });

    user.isSubscribed = true;
    user.subscriptionPlan = plan;
    user.stripeSubscriptionId = subscription.id;
    user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
    await user.save();

    res.json({ message: 'Subscription created', subscriptionId: subscription.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/subscriptions/cancel
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeSubscriptionId)
      return res.status(400).json({ message: 'No active subscription' });

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

module.exports = { createSubscription, cancelSubscription, getSubscriptionStatus };