import api from './api';

export const reportService = {
  getDashboardSummary: async () => {
    const response = await api.get('/api/reports/dashboard-summary');
    return response.data;
  },

  getFinancialHistory: async (year) => {
    const params = year ? { year } : {};
    const response = await api.get('/api/reports/financials', { params });
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/api/reports/recent-activities');
    return response.data;
  },
  
  getExpiringLeases: async (days = 30) => {
      const response = await api.get('/api/reports/leases/expiring', { params: { days } });
      return response.data;
  },

  getLatePayments: async (month, year) => {
      const response = await api.get('/api/reports/late-payments', { params: { referenceMonth: month, referenceYear: year } });
      return response.data;
  }
};