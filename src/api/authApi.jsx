import axios from './axios';

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  resetPassword: async (email) => {
    try {
      const response = await axios.post('/users/reset-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
};