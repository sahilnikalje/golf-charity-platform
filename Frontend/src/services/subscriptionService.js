import api from './api.js';
export const createSubscription = (data) => api.post('/subscriptions/create', data);
export const cancelSubscription = () => api.post('/subscriptions/cancel');
export const getSubscriptionStatus = () => api.get('/subscriptions/status');