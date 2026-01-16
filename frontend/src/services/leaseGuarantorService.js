import api from './api';

export const leaseGuarantorService = {
  
  /* Create Link */
  createLeaseGuarantor: async (data) => {
    const response = await api.post('/api/lease-guarantors', data);
    return response.data;
  },

  /* Read by Lease */
  getByLeaseId: async (leaseId) => {
    const response = await api.get(`/api/lease-guarantors?leaseId=${leaseId}`);
    return response.data;
  },

  /* Delete Link */
  deleteLeaseGuarantor: async (id) => {
    await api.delete(`/api/lease-guarantors/${id}`);
  }
};