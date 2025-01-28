import { weatherApi } from '@/api/weatherApi';
import { useCallback, useEffect, useState } from 'react';

export const useWeather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAndFetchData = async (locationId) => {
    try {
      await weatherApi.generatePredictions();
      const retryWeekly = await weatherApi.getWeeklyForecast(locationId);
      if (!retryWeekly.error) {
        setWeeklyForecast(retryWeekly.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error in generateAndFetchData:', err);
    }
  };

  const fetchWeatherData = useCallback(async (locationId) => {
    if (locationId === null) return;

    try {
      setLoading(true);
      setError(null);
      
      // First attempt to get data
      const weekly = await weatherApi.getWeeklyForecast(locationId);
      
      if (!weekly.error && weekly.data.length > 0) {
        setWeeklyForecast(weekly.data);
      } else {
        // If no data, try to generate and fetch again
        await generateAndFetchData(locationId);
      }
    } catch (err) {
      console.error('Error in fetchWeatherData:', err);
      setError('Failed to load weather data');
      // Try to generate data if fetch failed
      await generateAndFetchData(locationId);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation === null) {
      setSelectedLocation(0); // Default to Colombo
    } else {
      fetchWeatherData(selectedLocation);
    }
  }, [selectedLocation, fetchWeatherData]);

  const handleLocationChange = async (newLocation) => {
    const locationId = parseInt(newLocation);
    setWeeklyForecast(null); // Clear current data
    setSelectedLocation(locationId);
  };

  return {
    selectedLocation,
    setSelectedLocation: handleLocationChange,
    weeklyForecast,
    loading,
    error,
    refreshWeather: () => fetchWeatherData(selectedLocation),
  };
};