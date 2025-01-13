// src/api/authApi.jsx
import axios from './axios';

export const authApi = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await axios.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout (optional - might be handled client-side)
  logout: () => {
    localStorage.removeItem('token');
  },

  // Password reset request
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authApi;