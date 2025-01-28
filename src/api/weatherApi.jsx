import axios from './axios';

const API_BASE_URL = '/weather';

const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.response?.data?.message || defaultMessage,
    data: []
  };
};

export const weatherApi = {
  // Get available locations
  getLocations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations`);
      return { error: false, data: response.data };
    } catch (error) {
      return handleApiError(error, 'Failed to load locations');
    }
  },

  // Get 7-day weather forecast for a location
  getForecast: async (locationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast/${locationId}`);
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

  // Get daily weather predictions for a location
  getDailyForecast: async (locationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily/${locationId}`);
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

  // Get weekly weather predictions for a location
  getWeeklyForecast: async (locationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weekly/${locationId}`);
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