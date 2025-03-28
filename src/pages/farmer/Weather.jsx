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
    
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(startDate);
    sevenDaysFromNow.setDate(startDate.getDate() + 6);
    
    const validForecasts = forecasts.filter(forecast => {
      const forecastDate = new Date(forecast.predictionDate);
      forecastDate.setHours(0, 0, 0, 0);
      return forecastDate >= startDate && forecastDate <= sevenDaysFromNow;
    });

    const uniqueForecasts = {};
    validForecasts.forEach(forecast => {
      const date = new Date(forecast.predictionDate).toDateString();
      if (!uniqueForecasts[date]) {
        uniqueForecasts[date] = forecast;
      }
    });
    
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
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <CardTitle className="text-white text-xl md:text-2xl mb-4 md:mb-0">
            7-Day Weather Forecast {currentCity && `- ${currentCity}`}
          </CardTitle>
          <div className="flex gap-4 items-center">
            <Select
              value={selectedLocation?.toString()}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[220px] bg-white/90 hover:bg-white">
                <SelectValue placeholder="Select location">
                  {currentCity || "Select location"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[60vh] overflow-y-auto">
                {locationData.map((location) => (
                  <SelectItem 
                    key={location.id} 
                    value={location.id.toString()}
                    className="hover:bg-blue-50"
                  >
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : !uniqueForecasts || uniqueForecasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
              <Alert className="w-full max-w-md">
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription>
                  No weather forecast data available for {currentCity}.
                </AlertDescription>
              </Alert>
              {!loading && (
                <button
                  onClick={refreshWeather}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                >
                  Retry Loading
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
                {uniqueForecasts.map((day, index) => (
                  <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                      <div className="text-lg font-semibold text-white">
                        {new Date(day.predictionDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        {getWeatherIcon(day.weatherType)}
                        <div className="text-3xl font-bold text-gray-800">
                          {day.temperature.toFixed(1)}°C
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CloudRain className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-700">
                            Rain: {(day.rainfallProbability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Wind className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">
                            Wind: {day.windSpeed.toFixed(1)} km/h
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {day.weatherType.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!hasFullWeek && !loading && (
                <Alert className="mt-6">
                  <AlertTriangle className="h-5 w-5" />
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