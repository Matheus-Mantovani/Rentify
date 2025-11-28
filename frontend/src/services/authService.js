import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};