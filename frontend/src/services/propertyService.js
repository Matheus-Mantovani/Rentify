import api from './api';

export const propertyService = {
  getAllProperties: async () => {
    const response = await api.get('/api/properties/details');
    return response.data;
  },

  getPropertyById: async (id) => {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  },

  getPropertyFinancialHistory: async (id) => {
    const response = await api.get(`/api/history/properties/${id}/financials`);
    return response.data;
  },

  createProperty: async (data) => {
    const response = await api.post('/api/properties', data);
    return response.data;
  },

  updateProperty: async (id, data) => {
    const response = await api.put(`/api/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id) => {
    await api.delete(`/api/properties/${id}`);
  }
};