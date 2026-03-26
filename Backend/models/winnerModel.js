const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  draw: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  matchType: { type: String, enum: ['5-match', '4-match', '3-match'], required: true },
  prizeAmount: { type: Number, required: true },
  proofImage: { type: String, default: null },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  adminNote: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Winner', winnerSchema);