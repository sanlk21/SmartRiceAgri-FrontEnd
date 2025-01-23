import { weatherApi } from '@/api/weatherApi';
import { useEffect, useState } from 'react';

export const useWeather = () => {
 const [dailyForecast, setDailyForecast] = useState(null);
 const [weeklyForecast, setWeeklyForecast] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 const fetchWeatherData = async () => {
   try {
     setLoading(true);
     const [daily, weekly] = await Promise.all([
       weatherApi.getDailyForecast(),
       weatherApi.getWeeklyForecast(),
     ]);

     setDailyForecast(daily);
     setWeeklyForecast(weekly);
     setError(null);
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchWeatherData();
   // Refresh weather data every 30 minutes
   const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
   return () => clearInterval(interval);
 }, []);

 return {
   dailyForecast,
   weeklyForecast,
   loading,
   error,
   refreshWeather: fetchWeatherData,
 };
};