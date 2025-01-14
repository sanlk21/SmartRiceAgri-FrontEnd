// src/components/farmer/WeatherAlert.jsx
import { getAlertIcon } from '@/utils/weatherUtils';
import PropTypes from 'prop-types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const WeatherAlert = ({ alerts = [] }) => {
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
          <div className="ml-3">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
};

WeatherAlert.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      severity: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  )
};

export default WeatherAlert;