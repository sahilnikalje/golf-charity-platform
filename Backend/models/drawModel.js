const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  winningNumbers: { type: [Number], default: [] },
  drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
  totalPrizePool: { type: Number, default: 0 },
  jackpotAmount: { type: Number, default: 0 },
  fourMatchAmount: { type: Number, default: 0 },
  threeMatchAmount: { type: Number, default: 0 },
  jackpotRolledOver: { type: Boolean, default: false },
  rolledOverAmount: { type: Number, default: 0 },
  winners: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      matchType: { type: String, enum: ['5-match', '4-match', '3-match'] },
      prizeAmount: { type: Number },
      paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);