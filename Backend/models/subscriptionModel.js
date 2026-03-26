const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'lapsed'], default: 'active' },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  amount: { type: Number, required: true },
  charityContribution: { type: Number, required: true },
  prizePoolContribution: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  renewalDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);