const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const Draw = require('../models/drawModel');
const Winner = require('../models/winnerModel');
const Charity = require('../models/charityModel');

// @GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubscribers = await User.countDocuments({ isSubscribed: true });
    const totalCharities = await Charity.countDocuments();
    const totalDraws = await Draw.countDocuments({ status: 'published' });
    const totalWinners = await Winner.countDocuments();
    res.json({ totalUsers, activeSubscribers, totalCharities, totalDraws, totalWinners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('selectedCharity', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/winners
const getAllWinners = async (req, res) => {
  try {
    const winners = await Winner.find({})
      .populate('user', 'name email')
      .populate('draw', 'month year winningNumbers')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/winners/:id/verify
const verifyWinner = async (req, res) => {
  try {
    const { verificationStatus, adminNote } = req.body;
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { verificationStatus, adminNote },
      { new: true }
    );
    res.json(winner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/winners/:id/payout
const markPayout = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid' },
      { new: true }
    );
    res.json(winner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, updateUser, deleteUser, getAllWinners, verifyWinner, markPayout };