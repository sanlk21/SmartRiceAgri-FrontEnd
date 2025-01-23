import axios from './axios';

export const weatherApi = {
 getDailyForecast: async () => {
   const response = await axios.get('/weather/daily');
   return response.data;
 },

 getWeeklyForecast: async () => {
   const response = await axios.get('/weather/weekly');
   return response.data;
 },

 getLocationWeather: async (latitude, longitude) => {
   const response = await axios.get(`/weather/location?lat=${latitude}&lon=${longitude}`);
   return response.data;
 },
};