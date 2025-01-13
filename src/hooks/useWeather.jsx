import { useEffect, useState } from 'react';
import { weatherApi } from '../api/weatherApi';

export const useWeather = () => {
    const [dailyForecast, setDailyForecast] = useState(null);
    const [weeklyForecast, setWeeklyForecast] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            const [daily, weekly, alertsData] = await Promise.all([
                weatherApi.getDailyForecast(),
                weatherApi.getWeeklyForecast(),
                weatherApi.getWeatherAlerts()
            ]);

            setDailyForecast(daily);
            setWeeklyForecast(weekly);
            setAlerts(alertsData);
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
        alerts,
        loading,
        error,
        refreshWeather: fetchWeatherData
    };
};