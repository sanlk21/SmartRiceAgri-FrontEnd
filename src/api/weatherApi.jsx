import axios from './axios';

export const weatherApi = {
    getDailyForecast: async () => {
        const response = await axios.get('/api/weather/daily');
        return response.data;
    },

    getWeeklyForecast: async () => {
        const response = await axios.get('/api/weather/weekly');
        return response.data;
    },

    getLocationWeather: async (latitude, longitude) => {
        const response = await axios.get(`/api/weather/location?lat=${latitude}&lon=${longitude}`);
        return response.data;
    },

    getWeatherAlerts: async () => {
        const response = await axios.get('/api/weather/alerts');
        return response.data;
    }
};