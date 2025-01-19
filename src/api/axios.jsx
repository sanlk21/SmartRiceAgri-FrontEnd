import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Changed to work with Vite proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          window.location.href = '/unauthorized';
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        case 404:
          console.error('API Not Found:', error.config.url);
          break;
      }
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend server');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;