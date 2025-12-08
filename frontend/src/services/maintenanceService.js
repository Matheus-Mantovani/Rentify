import api from './api';

export const maintenanceService = {
  getAllJobs: async (propertyId = null) => {
    const params = propertyId ? { propertyId } : {};
    const response = await api.get('api/maintenance-jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`api/maintenance-jobs/${id}`);
    return response.data;
  },

  createJob: async (data) => {
    const response = await api.post('api/maintenance-jobs', data);
    return response.data;
  },

  updateJob: async (id, data) => {
    const response = await api.put(`api/maintenance-jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`api/maintenance-jobs/${id}`);
    return response.data;
  }
};