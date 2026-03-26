import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  getSubscriptionStatus,
  cancelSubscription,
  createCheckoutSession,
} from "../../services/subscriptionService.js";
import "./Subscription.css";

// Initialize Stripe (will use Stripe key from backend via checkout session)
const stripePromise = loadStripe("pk_test_51T6T0N2K27CUzi9dh5S8X8J9K5L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0");

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₹999",
    period: "/month",
    prizePool: "₹500",
    charity: "₹100+",
    desc: "Flexible — cancel anytime",
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "₹9999",
    period: "/year",
    prizePool: "₹5000",
    charity: "₹1000+",
    desc: "Save 17% vs monthly",
    popular: true,
  },
];

export default function Subscription() {
  const [selected, setSelected] = useState("monthly");
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for payment status in URL
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success("✓ Subscription activated! Welcome aboard.");
      getSubscriptionStatus()
        .then((r) => setSub(r.data))
        .catch((err) => console.error(err));
    } else if (status === "cancelled") {
      toast.info("Payment cancelled. Try again whenever you're ready.");
    }

    // Load subscription status
    getSubscriptionStatus()
      .then((r) => setSub(r.data))
      .catch(() => {});
  }, [searchParams]);

  const handleSubscribe = async () => {
    if (!selected) {
      toast.error("Please select a plan");
      return;
    }

    setLoading(true);
    try {
      const response = await createCheckoutSession(selected);
      if (response.data.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (error) {
          toast.error(error.message || "Failed to redirect to checkout");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create checkout session"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription?")) return;
    setLoading(true);
    try {
      await cancelSubscription();
      toast.success("✓ Subscription cancelled");
      setSub(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setLoading(false);
    }
  };

  if (sub && sub.status === "active") {
    return (
      <div className="sub-page">
        <div className="sub-container">
          <div className="active-sub-card">
            <div className="sub-active-badge">✓ Active Subscription</div>
            <h2>{sub.plan === "yearly" ? "Yearly" : "Monthly"} Plan</h2>
            <div className="sub-details">
              <div className="sub-detail-item">
                <span>Amount</span>
                <strong>₹{sub.amount}</strong>
              </div>
              <div className="sub-detail-item">
                <span>Charity Contribution</span>
                <strong>₹{sub.charityContribution?.toFixed(2)}</strong>
              </div>
              <div className="sub-detail-item">
                <span>Prize Pool Contribution</span>
                <strong>₹{sub.prizePoolContribution?.toFixed(2)}</strong>
              </div>
              <div className="sub-detail-item">
                <span>Renewal Date</span>
                <strong>
                  {sub.renewalDate
                    ? new Date(sub.renewalDate).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>
            <button
              className="btn-cancel-sub"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-page">
      <div className="sub-container">
        <div className="sub-header">
          <h1>Choose Your Plan</h1>
          <p>
            Subscribe to enter monthly draws and support your chosen charity
          </p>
        </div>
        <div className="plan-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selected === plan.id ? "selected" : ""} ${plan.popular ? "popular" : ""}`}
              onClick={() => setSelected(plan.id)}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <h3>{plan.label}</h3>
              <div className="plan-price">
                {plan.price}
                <span>{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-breakdown">
                <div className="plan-break-item">
                  <span>Prize Pool Contribution</span>
                  <strong>{plan.prizePool}</strong>
                </div>
                <div className="plan-break-item">
                  <span>Min Charity Donation</span>
                  <strong>{plan.charity}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sub-action">
          <button
            className="btn-subscribe-now"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Processing..." : `Subscribe — ${selected === "yearly" ? "₹9999/yr" : "₹999/mo"}`}
          </button>
          <p className="sub-note">Secure payment via Stripe. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
