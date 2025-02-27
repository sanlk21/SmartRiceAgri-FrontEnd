// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', // Fixed typo: 'Johnstone-Type' to 'Content-Type'
  },
  withCredentials: false,
});

// Store the current user globally
let currentUser = null;

export const setAuthUser = (user) => {
  currentUser = user; // Update the global user state
  if (process.env.NODE_ENV === 'development') {
    console.log('User set in axios:', currentUser);
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.signal?.aborted) {
      return Promise.reject(new Error('Request was aborted'));
    }

    // Add X-User-Nic header if user is available
    if (currentUser?.nic) {
      config.headers['X-User-Nic'] = currentUser.nic;
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('No user NIC available for request:', config.url);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: { 'X-User-Nic': config.headers['X-User-Nic'] || 'None' },
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject(error);
    }
    if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data);
      if (error.response.status === 401) {
        console.error('Unauthorized:', error.response.data);
        // Optionally clear user and redirect to login
        if (error.response.data.error === 'User NIC not provided') {
          return Promise.reject(new Error('Please log in to continue'));
        }
      }
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend server');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout exceeded');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;