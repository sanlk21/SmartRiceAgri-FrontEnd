import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeather } from '@/hooks/useWeather';
import { AlertTriangle, Cloud, CloudRain, Droplets, Sun, Wind } from 'lucide-react';
import React from 'react';

const locationData = [
  { id: 0, name: 'Colombo' },
  { id: 1, name: 'Gampaha' },
  { id: 2, name: 'Kalutara' },
  { id: 3, name: 'Kandy' },
  { id: 4, name: 'Matale' },
  { id: 5, name: 'Nuwara Eliya' },
  { id: 6, name: 'Galle' },
  { id: 7, name: 'Matara' },
  { id: 8, name: 'Hambantota' },
  { id: 9, name: 'Jaffna' },
  { id: 10, name: 'Kilinochchi' },
  { id: 11, name: 'Mannar' },
  { id: 12, name: 'Vavuniya' },
  { id: 13, name: 'Mullaitivu' },
  { id: 14, name: 'Batticaloa' },
  { id: 15, name: 'Ampara' },
  { id: 16, name: 'Trincomalee' },
  { id: 17, name: 'Kurunegala' },
  { id: 18, name: 'Puttalam' },
  { id: 19, name: 'Anuradhapura' },
  { id: 20, name: 'Polonnaruwa' },
  { id: 21, name: 'Badulla' },
  { id: 22, name: 'Moneragala' },
  { id: 23, name: 'Ratnapura' },
  { id: 24, name: 'Kegalle' },
  { id: 25, name: 'Welimada' },
  { id: 26, name: 'Bandarawela' }
];

const Weather = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    weeklyForecast,
    loading,
    error,
    refreshWeather
  } = useWeather();

  const getCityName = (locationId) => {
    const location = locationData.find(loc => loc.id === parseInt(locationId));
    return location ? location.name : '';
  };

  const getUniqueForecastsByDate = (forecasts) => {
    if (!forecasts) return [];
    
    // Get today's date at midnight for comparison
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(startDate);
    sevenDaysFromNow.setDate(startDate.getDate() + 6);
    
    // Filter forecasts within the 7-day window
    const validForecasts = forecasts.filter(forecast => {
      const forecastDate = new Date(forecast.predictionDate);
      forecastDate.setHours(0, 0, 0, 0);
      return forecastDate >= startDate && forecastDate <= sevenDaysFromNow;
    });

    // Group by date and take the first forecast for each day
    const uniqueForecasts = {};
    validForecasts.forEach(forecast => {
      const date = new Date(forecast.predictionDate).toDateString();
      if (!uniqueForecasts[date]) {
        uniqueForecasts[date] = forecast;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(uniqueForecasts)
      .sort((a, b) => new Date(a.predictionDate) - new Date(b.predictionDate));
  };

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

  const uniqueForecasts = getUniqueForecastsByDate(weeklyForecast);
  const currentCity = getCityName(selectedLocation);
  const hasFullWeek = uniqueForecasts.length === 7;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            7-Day Weather Forecast {currentCity && `- ${currentCity}`}
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Select
              value={selectedLocation?.toString()}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select location">
                  {currentCity || "Select location"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {locationData.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : !uniqueForecasts || uniqueForecasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No weather forecast data available for {currentCity}.
                </AlertDescription>
              </Alert>
              {!loading && (
                <button
                  onClick={refreshWeather}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry Loading
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {uniqueForecasts.map((day, index) => (
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
              {!hasFullWeek && !loading && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Some forecast data is missing. Please try refreshing.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;