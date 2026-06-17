// Authentication Service
import apiClient from './api';

// Register user
export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// Login user
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

// Get current user profile
export const getCurrentUser = () => {
  return apiClient.get('/auth/profile');
};

// Update user profile
export const updateProfile = (userData) => {
  return apiClient.put('/auth/profile', userData);
};

// Change password
export const changePassword = (passwordData) => {
  return apiClient.post('/auth/change-password', passwordData);
};

// Verify token
export const verifyToken = (token) => {
  return apiClient.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
