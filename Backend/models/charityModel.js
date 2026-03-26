const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  website: { type: String, default: '' },
  category: { type: String, default: 'General' },
  isFeatured: { type: Boolean, default: false },
  upcomingEvents: [
    {
      title: String,
      date: Date,
      description: String,
    },
  ],
  totalReceived: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);