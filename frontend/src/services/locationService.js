import api from './api';

export const locationService = {
  getStates: async () => {
    const response = await api.get('/api/locations/states');
    return response.data;
  },

  getCities: async (stateId) => {
    const response = await api.get(`/api/locations/cities`, { 
      params: { stateId } 
    });
    return response.data;
  },

  searchCities: async (query, stateId) => {
    const response = await api.get('/api/locations/cities/search', {
      params: { query, stateId }
    });
    return response.data;
  }
};