import api from './api.js';
export const getCharities = (params) => api.get('/charities', { params });
export const getCharityById = (id) => api.get(`/charities/${id}`);
export const createCharity = (data) => api.post('/charities', data);
export const updateCharity = (id, data) => api.put(`/charities/${id}`, data);
export const deleteCharity = (id) => api.delete(`/charities/${id}`);