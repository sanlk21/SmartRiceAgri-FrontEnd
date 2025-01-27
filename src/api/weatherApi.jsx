import axios from './axios';

const API_BASE_URL = '/weather'; // Ensure the base URL matches your backend endpoint

const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.response?.data?.message || defaultMessage,
    data: [] // Return an empty array for consistent frontend processing
  };
};

export const weatherApi = {
  // Get 7-day weather forecast
  getForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast`);
      if (response.data && response.data.length > 0) {
        return { error: false, data: response.data };
      }
      return {
        error: true,
        message: 'No forecast data available.',
        data: []
      };
    } catch (error) {
      return handleApiError(error, 'Failed to load weather forecast');
    }
  },

  // Get daily weather predictions
  getDailyForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily`);
      if (response.data && response.data.length > 0) {
        return { error: false, data: response.data };
      }
      return {
        error: true,
        message: 'No daily forecast data available.',
        data: []
      };
    } catch (error) {
      return handleApiError(error, 'Failed to load daily forecast');
    }
  },

  // Get weekly weather predictions
  getWeeklyForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weekly`);
      if (response.data && response.data.length > 0) {
        return { error: false, data: response.data };
      }
      return {
        error: true,
        message: 'No weekly forecast data available.',
        data: []
      };
    } catch (error) {
      return handleApiError(error, 'Failed to load weekly forecast');
    }
  },

  // Trigger weather prediction generation manually (admin-only endpoint)
  generatePredictions: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`);
      return { error: false, message: 'Predictions generated successfully.' };
    } catch (error) {
      return handleApiError(error, 'Failed to generate predictions');
    }
  }
};

export default weatherApi;
