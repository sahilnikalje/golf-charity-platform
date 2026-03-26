const mongoose = require('mongoose');

const scoreEntrySchema = new mongoose.Schema({
  value: { type: Number, required: true, min: 1, max: 45 },
  date: { type: Date, required: true },
});

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  scores: {
    type: [scoreEntrySchema],
    validate: [arr => arr.length <= 5, 'Maximum 5 scores allowed'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);