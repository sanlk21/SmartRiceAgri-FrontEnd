import { weatherApi } from '@/api/weatherApi';
import { useEffect, useState } from 'react';

export const useWeather = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await weatherApi.getLocations();
      if (!response.error && response.data.length > 0) {
        setLocations(response.data);
        // If no location is selected, select the first one
        if (!selectedLocation) {
          setSelectedLocation(response.data[0]);
        }
      } else {
        setError('No locations available');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);
      const [daily, weekly] = await Promise.all([
        weatherApi.getDailyForecast(selectedLocation),
        weatherApi.getWeeklyForecast(selectedLocation),
      ]);

      if (!daily.error) setDailyForecast(daily.data);
      if (!weekly.error) setWeeklyForecast(weekly.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch weather data when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData();
      // Refresh weather data every 30 minutes
      const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [selectedLocation]);

  return {
    locations,
    selectedLocation,
    setSelectedLocation,
    dailyForecast,
    weeklyForecast,
    loading,
    error,
    refreshWeather: fetchWeatherData,
  };
};