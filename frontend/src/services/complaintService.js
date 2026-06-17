// Complaints Service
import apiClient from './api';

// Create complaint
export const createComplaint = (formData) => {
  return apiClient.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Get user's complaints
export const getUserComplaints = (page = 1, limit = 10) => {
  return apiClient.get('/complaints/my-complaints', { params: { page, limit } });
};

// Get all complaints (Admin)
export const getAllComplaints = (page = 1, limit = 10, status = null, priority = null) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (priority) params.priority = priority;
  return apiClient.get('/complaints', { params });
};

// Update complaint status
export const updateComplaintStatus = (complaintId, statusData) => {
  return apiClient.put(`/complaints/${complaintId}/status`, statusData);
};

// Assign complaint to worker
export const assignComplaint = (complaintId, workerId) => {
  return apiClient.put(`/complaints/${complaintId}/assign`, { assigned_worker_id: workerId });
};
