import { AlertCircle, Cloud, Droplets, Wind } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const getAlertIcon = (type) => {
  switch (type) {
    case 'RAIN':
      return <Droplets className="h-4 w-4" />;
    case 'WIND':
      return <Wind className="h-4 w-4" />;
    case 'STORM':
      return <Cloud className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const WeatherAlert = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <Alert 
          key={index}
          variant={alert.severity === 'HIGH' ? 'destructive' : 'warning'}
          className="flex items-center"
        >
          {getAlertIcon(alert.type)}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default WeatherAlert;