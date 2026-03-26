import api from './api.js';
export const updateProfile = (data) => api.put('/auth/update', data);