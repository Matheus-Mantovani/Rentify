import api from './api';

export const guarantorService = {
  getAllGuarantors: async () => {
    const response = await api.get('/api/guarantors');
    return response.data;
  },

  getAllGuarantorsDetails: async () => {
    const response = await api.get('/api/guarantors/details');
    return response.data;
  },

  getGuarantorById: async (id) => {
    const response = await api.get(`/api/guarantors/${id}`);
    return response.data;
  },

  createGuarantor: async (data) => {
    const response = await api.post('/api/guarantors', data);
    return response.data;
  },

  updateGuarantor: async (id, data) => {
    const response = await api.put(`/api/guarantors/${id}`, data);
    return response.data;
  },

  deleteGuarantor: async (id) => {
    await api.delete(`/api/guarantors/${id}`);
  }
};