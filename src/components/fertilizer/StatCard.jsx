// src/components/fertilizer/StatCard.jsx
import { Card, CardContent } from '@/components/ui/card';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="h-[120px]">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-8 w-8" style={{ color: getColorValue(color) }} />
      </div>
    </CardContent>
  </Card>
);

const getColorValue = (color) => {
  const colors = {
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6'
  };
  return colors[color] || colors.blue;
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'purple']).isRequired
};

export default StatCard;