const express = require('express');
const router = express.Router();
const { getCharities, getCharityById, createCharity, updateCharity, deleteCharity } = require('../controllers/charityController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get('/', getCharities);
router.get('/:id', getCharityById);
router.post('/', protect, adminOnly, createCharity);
router.put('/:id', protect, adminOnly, updateCharity);
router.delete('/:id', protect, adminOnly, deleteCharity);

module.exports = router;