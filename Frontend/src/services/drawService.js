import api from './api.js';
export const getDraws = () => api.get('/draws');
export const getLatestDraw = () => api.get('/draws/latest');
export const simulateDraw = (data) => api.post('/draws/simulate', data);
export const publishDraw = (id) => api.post(`/draws/${id}/publish`);