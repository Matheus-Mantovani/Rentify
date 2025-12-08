import api from './api';

export const leaseGuarantorService = {
  addGuarantor: async (data) => {
    const response = await api.post('/api/lease-guarantors', data);
    return response.data;
  },

  getByLeaseId: async (leaseId) => {
    const response = await api.get(`/api/lease-guarantors?leaseId=${leaseId}`);
    return response.data;
  },

  removeGuarantor: async (id) => {
    await api.delete(`/api/lease-guarantors/${id}`);
  }
};