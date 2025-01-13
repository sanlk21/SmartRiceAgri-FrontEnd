// src/api/axios.jsx
import axios from 'axios';

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - redirect to unauthorized page
          window.location.href = '/unauthorized';
          break;
        case 500:
          // Server error
          console.error('Server Error:', error.response.data);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;