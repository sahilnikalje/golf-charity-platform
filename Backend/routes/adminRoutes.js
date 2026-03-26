const express = require('express');
const router = express.Router();
const {
  getStats, getAllUsers, updateUser, deleteUser,
  getAllWinners, verifyWinner, markPayout
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/winners', getAllWinners);
router.put('/winners/:id/verify', verifyWinner);
router.put('/winners/:id/payout', markPayout);

module.exports = router;