import api from './api';

export const leaseService = {
  // GET /api/leases?status=ACTIVE&landlordProfileId=123
  getAllLeases: async (filters = {}) => {
    const response = await api.get('/api/leases', { params: filters });
    return response.data;
  },

  // GET /api/leases/{id}
  getLeaseById: async (id) => {
    const response = await api.get(`/api/leases/${id}`);
    return response.data;
  },

  // POST /api/leases
  createLease: async (data) => {
    const response = await api.post('/api/leases', data);
    return response.data;
  },

  // PUT /api/leases/{id}
  updateLease: async (id, data) => {
    const response = await api.put(`/api/leases/${id}`, data);
    return response.data;
  },
  
  // POST /api/leases/{id}/terminate
  terminateLease: async (id, data) => {
      const response = await api.post(`/api/leases/${id}/terminate`, data);
      return response.data;
  }
};