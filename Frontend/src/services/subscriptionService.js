import api from './api.js';

export const createCheckoutSession = (plan) => 
  api.post('/subscriptions/checkout-session', { plan });

export const cancelSubscription = () => 
  api.post('/subscriptions/cancel');

export const getSubscriptionStatus = () => 
  api.get('/subscriptions/status');