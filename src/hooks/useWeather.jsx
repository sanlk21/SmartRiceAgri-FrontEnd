import { weatherApi } from '@/api/weatherApi';
import { useCallback, useEffect, useState } from 'react';

export const useWeather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to check if we have a complete 7-day forecast
  const validateForecastData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.predictionDate) - new Date(b.predictionDate)
    );

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if we have continuous dates for 7 days
    const dates = sortedData.map(d => {
      const date = new Date(d.predictionDate);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Check for unique dates
    const uniqueDates = new Set(dates);
    if (uniqueDates.size !== 7) return false;

    // Check for date continuity
    for (let i = 0; i < 7; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() + i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (!dates.includes(expectedDate.getTime())) {
        return false;
      }
    }

    return true;
  };

  const processWeatherData = (data) => {
    if (!Array.isArray(data)) return [];

    // Sort by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.predictionDate) - new Date(b.predictionDate)
    );

    // Ensure we have exactly 7 days starting from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const processedData = [];
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      
      const existingForecast = sortedData.find(d => {
        const forecastDate = new Date(d.predictionDate);
        forecastDate.setHours(0, 0, 0, 0);
        return forecastDate.getTime() === targetDate.getTime();
      });

      if (existingForecast) {
        processedData.push(existingForecast);
      }
    }

    return processedData;
  };

  const generateAndFetchData = async (locationId) => {
    try {
      await weatherApi.generatePredictions();
      const retryWeekly = await weatherApi.getWeeklyForecast(locationId);
      
      if (!retryWeekly.error) {
        const processedData = processWeatherData(retryWeekly.data);
        if (validateForecastData(processedData)) {
          setWeeklyForecast(processedData);
          setError(null);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error in generateAndFetchData:', err);
      return false;
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
        const processedData = processWeatherData(weekly.data);
        if (validateForecastData(processedData)) {
          setWeeklyForecast(processedData);
          return;
        }
      }
      
      // If data is invalid or missing, try to generate new data
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        const success = await generateAndFetchData(locationId);
        if (success) return;
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between retries
      }
      
      setError('Unable to load complete forecast data');
    } catch (err) {
      console.error('Error in fetchWeatherData:', err);
      setError('Failed to load weather data');
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

  const handleLocationChange = (newLocation) => {
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