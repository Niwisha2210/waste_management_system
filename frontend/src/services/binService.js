// Smart Bins Service
import apiClient from './api';

// Get all bins
export const getAllBins = (page = 1, limit = 10) => {
  return apiClient.get('/bins', { params: { page, limit } });
};

// Get bin by ID
export const getBinById = (binId) => {
  return apiClient.get(`/bins/${binId}`);
};

// Create new bin (Admin)
export const createBin = (binData) => {
  return apiClient.post('/bins', binData);
};

// Update bin fill level (Admin)
export const updateBinFillLevel = (binId, fillLevel) => {
  return apiClient.put(`/bins/${binId}/fill-level`, { fill_level: fillLevel });
};

// Get bins by status
export const getBinsByStatus = (status) => {
  return apiClient.get(`/bins/status/${status}`);
};

// Get nearby bins
export const getNearbyBins = (latitude, longitude, radius = 5) => {
  return apiClient.get('/bins/nearby/list', {
    params: { latitude, longitude, radius }
  });
};
