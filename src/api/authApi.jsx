import axios from 'axios';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  // Setup axios interceptors for handling token expiration
  setupInterceptors: (onUnauthorized) => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Call the callback for unauthorized requests
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
    return interceptor;
  },

  // Remove interceptor
  removeInterceptor: (interceptor) => {
    axiosInstance.interceptors.response.eject(interceptor);
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/users/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await axiosInstance.get('/auth/verify');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/profile', profileData);
    return response.data;
  },

  // Password reset request
  resetPassword: async (email) => {
    const response = await axiosInstance.post('/auth/reset-password', { email });
    return response.data;
  },
};