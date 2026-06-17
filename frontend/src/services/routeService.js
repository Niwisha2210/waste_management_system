// Routes Service
import apiClient from './api';

// Create route
export const createRoute = (routeData) => {
  return apiClient.post('/routes', routeData);
};

// Get all routes (Admin)
export const getAllRoutes = (page = 1, limit = 10) => {
  return apiClient.get('/routes', { params: { page, limit } });
};

// Get worker routes
export const getWorkerRoutes = (workerId, status = null, date = null) => {
  const params = {};
  if (status) params.status = status;
  if (date) params.date = date;
  return apiClient.get(`/routes/worker/${workerId}`, { params });
};

// Update route status
export const updateRouteStatus = (routeId, status) => {
  return apiClient.put(`/routes/${routeId}/status`, { status });
};

// Mark bin as collected
export const markBinCollected = (routeId, binId, wasteWeight) => {
  return apiClient.put(`/routes/${routeId}/bins/${binId}/collect`, { waste_weight_kg: wasteWeight });
};
