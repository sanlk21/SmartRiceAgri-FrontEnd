import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
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