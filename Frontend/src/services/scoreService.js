import api from './api.js';
export const getScores = () => api.get('/scores');
export const addScore = (data) => api.post('/scores', data);
export const editScore = (id, data) => api.put(`/scores/${id}`, data);
export const deleteScore = (id) => api.delete(`/scores/${id}`);