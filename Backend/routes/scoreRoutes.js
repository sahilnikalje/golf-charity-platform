const express = require('express');
const router = express.Router();
const { getScores, addScore, editScore, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getScores);
router.post('/', protect, addScore);
router.put('/:id', protect, editScore);
router.delete('/:id', protect, deleteScore);

module.exports = router;