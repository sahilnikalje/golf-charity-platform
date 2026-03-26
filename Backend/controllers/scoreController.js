const Score = require('../models/scoreModel');

// @GET /api/scores
const getScores = async (req, res) => {
  try {
    let scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) return res.json({ scores: [] });
    const sorted = scoreDoc.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ scores: sorted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/scores
const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    if (!value || value < 1 || value > 45)
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    if (!date) return res.status(400).json({ message: 'Date is required' });

    let scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) {
      scoreDoc = new Score({ user: req.user._id, scores: [] });
    }

    scoreDoc.scores.push({ value, date });

    // Keep only latest 5 — remove oldest
    if (scoreDoc.scores.length > 5) {
      scoreDoc.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
      scoreDoc.scores = scoreDoc.scores.slice(0, 5);
    }

    await scoreDoc.save();
    res.status(201).json({ message: 'Score added', scores: scoreDoc.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/scores/:id
const editScore = async (req, res) => {
  try {
    const { value, date } = req.body;
    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) return res.status(404).json({ message: 'No scores found' });

    const entry = scoreDoc.scores.id(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Score entry not found' });

    if (value) entry.value = value;
    if (date) entry.date = date;
    await scoreDoc.save();
    res.json({ message: 'Score updated', scores: scoreDoc.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/scores/:id
const deleteScore = async (req, res) => {
  try {
    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) return res.status(404).json({ message: 'No scores found' });
    scoreDoc.scores = scoreDoc.scores.filter(s => s._id.toString() !== req.params.id);
    await scoreDoc.save();
    res.json({ message: 'Score deleted', scores: scoreDoc.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getScores, addScore, editScore, deleteScore };