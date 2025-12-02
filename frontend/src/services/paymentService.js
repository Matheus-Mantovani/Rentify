import api from './api';

export const paymentService = {
  // GET /api/payments?leaseId=... OR ?tenantId=...
  getAllPayments: async (filters = {}) => {
    const response = await api.get('/api/payments', { params: filters });
    return response.data;
  },

  // GET /api/payments/{id}
  getPaymentById: async (id) => {
    const response = await api.get(`/api/payments/${id}`);
    return response.data;
  },

  // POST /api/payments
  createPayment: async (data) => {
    const response = await api.post('/api/payments', data);
    return response.data;
  },
  
  // DELETE /api/payments/{id}
  deletePayment: async (id) => {
      await api.delete(`/api/payments/${id}`);
  }
};