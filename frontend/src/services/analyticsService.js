// Analytics Service
import apiClient from './api';

// Get dashboard analytics
export const getDashboardAnalytics = () => {
  return apiClient.get('/analytics/dashboard');
};

// Get waste trends
export const getWasteTrends = () => {
  return apiClient.get('/analytics/waste-trends');
};

// Get complaint analytics
export const getComplaintAnalytics = () => {
  return apiClient.get('/analytics/complaints');
};

// Get worker metrics
export const getWorkerMetrics = () => {
  return apiClient.get('/analytics/worker-metrics');
};

// Generate monthly report
export const generateMonthlyReport = (month, year) => {
  return apiClient.get('/analytics/report/monthly', { params: { month, year } });
};
