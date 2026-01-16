import api from './api';

const ENDPOINT = '/api/landlord-profiles';

export const landlordService = {
  getAllLandlords: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },

  getLandlordById: async (id) => {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  createLandlord: async (data) => {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  },

  updateLandlord: async (id, data) => {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  deleteLandlord: async (id) => {
    await api.delete(`${ENDPOINT}/${id}`);
  }
};