import api from './api';

export const reportService = {
  // GET /api/reports/dashboard-summary
  getDashboardSummary: async () => {
    const response = await api.get('/api/reports/dashboard-summary');
    return response.data;
  },

  // GET /api/reports/financials?year=2025
  getFinancialHistory: async (year) => {
    const params = year ? { year } : {};
    const response = await api.get('/api/reports/financials', { params });
    return response.data;
  },

  // GET /api/reports/annual-income?landlordProfileId=1&year=2025
  getAnnualIncome: async (landlordProfileId, year) => {
      const response = await api.get('/api/reports/annual-income', {
        params: { 
          landlordProfileId, 
          year 
        }
      });
      return response.data;
    },

  // GET /api/reports/recent-activities
  getRecentActivities: async () => {
    const response = await api.get('/api/reports/recent-activities');
    return response.data;
  },
  
  // GET /api/reports/leases/expiring?days=60
  getExpiringLeases: async (days = 60) => {
      const response = await api.get('/api/reports/leases/expiring', { params: { days } });
      return response.data;
  },

  // GET /api/reports/late-payments?referenceMonth=10&referenceYear=2025
  getLatePayments: async (month, year) => {
      const response = await api.get('/api/reports/late-payments', { 
        params: { 
          referenceMonth: month, 
          referenceYear: year 
        } 
      });
      return response.data;
  }
};