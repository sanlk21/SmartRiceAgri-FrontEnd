import WeatherAlert from '@/components/farmer/WeatherAlert';
import { Card } from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';
import React from 'react';

const Weather = () => {
  const { weeklyForecast, alerts, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <p className="text-red-600">Error loading weather data: {error}</p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Weather Forecast</h1>
      
      {/* Weather Alerts */}
      <WeatherAlert alerts={alerts} />
      
      {/* Weather Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weeklyForecast?.map((forecast, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-2">
              <p className="font-medium">{new Date(forecast.date).toLocaleDateString()}</p>
              <p>Temperature: {forecast.temperature}°C</p>
              <p>Rainfall: {forecast.rainfall}mm</p>
              <p>Wind Speed: {forecast.windSpeed} km/h</p>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Farming Recommendations */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Farming Recommendations</h2>
        <ul className="space-y-2">
          {weeklyForecast?.[0]?.rainfall > 30 && (
            <li>• High rainfall expected. Consider delaying any pesticide application.</li>
          )}
          {weeklyForecast?.[0]?.temperature > 32 && (
            <li>• High temperatures expected. Ensure adequate irrigation.</li>
          )}
          {weeklyForecast?.[0]?.windSpeed > 20 && (
            <li>• Strong winds expected. Secure any loose equipment or structures.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default Weather;