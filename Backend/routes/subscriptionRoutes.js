const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, cancelSubscription, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');

// Webhook endpoint (no auth needed, signature verified in controller)
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/checkout-session', protect, createCheckoutSession);
router.post('/cancel', protect, cancelSubscription);
router.get('/status', protect, getSubscriptionStatus);

module.exports = router;