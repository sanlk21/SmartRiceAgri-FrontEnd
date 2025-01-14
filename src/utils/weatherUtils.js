// src/utils/weatherUtils.js
import { AlertCircle, Cloud, Droplets, Wind } from 'lucide-react';

export const getAlertIcon = (type) => {
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