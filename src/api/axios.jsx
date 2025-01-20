// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't retry aborted requests
    if (config.signal?.aborted) {
      return Promise.reject(new Error('Request was aborted'));
    }

    // Log request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
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
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized:', error.response.data);
          // Handle unauthorized access (e.g., redirect to login)
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          console.error('Not Found:', error.config.url);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error(`Error ${error.response.status}:`, error.response.data);
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