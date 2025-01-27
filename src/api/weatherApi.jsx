import axios from './axios';

const API_BASE_URL = '/weather';

export const weatherApi = {
  // Get 7-day weather forecast
  getForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to load weather forecast',
        data: []
      };
    }
  },

  // Get daily weather predictions
  getDailyForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/daily`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to load daily forecast',
        data: []
      };
    }
  },

  // Get weekly weather predictions
  getWeeklyForecast: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weekly`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly forecast:', error);
      return {
        error: true,
        message: error.response?.data?.message || 'Failed to load weekly forecast',
        data: []
      };
    }
  }
};

export default weatherApi;