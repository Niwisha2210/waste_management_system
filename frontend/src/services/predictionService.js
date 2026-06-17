// Predictions Service
import apiClient from './api';

// Generate prediction for a bin
export const generateBinPrediction = (binId) => {
  return apiClient.post(`/predictions/${binId}`);
};

// Get critical predictions
export const getCriticalPredictions = () => {
  return apiClient.get('/predictions/critical');
};

// Generate predictions for all bins
export const generateAllPredictions = () => {
  return apiClient.post('/predictions');
};
