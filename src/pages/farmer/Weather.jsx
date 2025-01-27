import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';
import { AlertTriangle, Cloud, CloudRain, Droplets, Sun, Wind } from 'lucide-react';
import React from 'react';

const Weather = () => {
  const { weeklyForecast, loading, error } = useWeather();

  const getWeatherIcon = (type) => {
    switch (type) {
      case 'HEAVY_RAIN':
        return <CloudRain className="h-12 w-12 text-blue-600" />;
      case 'LIGHT_RAIN':
        return <Droplets className="h-12 w-12 text-blue-400" />;
      case 'MODERATE_RAIN':
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      case 'SUNNY':
        return <Sun className="h-12 w-12 text-orange-500" />;
      case 'FAIR':
        return <Sun className="h-12 w-12 text-yellow-400" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!weeklyForecast || weeklyForecast.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>No weather forecast data available.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>7-Day Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weeklyForecast.map((day, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="text-lg font-semibold">
                    {new Date(day.predictionDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    {getWeatherIcon(day.weatherType)}
                    <div className="text-2xl font-bold">{day.temperature.toFixed(1)}°C</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-blue-500" />
                      <span>Rain: {(day.rainfallProbability * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>Wind: {day.windSpeed.toFixed(1)} km/h</span>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-sm font-medium text-gray-600">
                        {day.weatherType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;