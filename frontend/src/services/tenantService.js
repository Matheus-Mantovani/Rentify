import api from './api';

export const tenantService = {
  // GET /api/tenants
  getAllTenants: async () => {
    const response = await api.get('/api/tenants');
    return response.data;
  },

  // GET /api/tenants/{id} (Detailed)
  getTenantById: async (id) => {
    const response = await api.get(`/api/tenants/${id}`);
    return response.data;
  },

  // POST /api/tenants
  createTenant: async (data) => {
    const response = await api.post('/api/tenants', data);
    return response.data;
  },

  // PUT /api/tenants/{id}
  updateTenant: async (id, data) => {
    const response = await api.put(`/api/tenants/${id}`, data);
    return response.data;
  },

  // DELETE /api/tenants/{id}
  deleteTenant: async (id) => {
    await api.delete(`/api/tenants/${id}`);
  }
};