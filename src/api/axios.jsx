import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Ensure this is consistent with your backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false since authentication is removed
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        case 404:
          console.error('API Not Found:', error.config.url);
          break;
        default:
          console.error(`Error: ${error.response.status}`, error.response.data);
          break;
      }
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Cannot connect to backend server');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
