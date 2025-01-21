// src/components/farmer/fertilizer/QuotaHistory.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

const QuotaHistory = ({ allocations }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'READY': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'EXPIRED': return 'text-red-600';
      case 'COLLECTED': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Allocations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {allocations.map((allocation) => (
            <div key={allocation.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {allocation.season} Season {allocation.year}
                  </p>
                  <p className="text-sm text-gray-500">
                    {allocation.allocatedAmount} kg
                  </p>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(allocation.status)}`}>
                  {allocation.status}
                </span>
              </div>
              {allocation.collectionDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Collected: {format(new Date(allocation.collectionDate), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

QuotaHistory.propTypes = {
  allocations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    allocatedAmount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    collectionDate: PropTypes.string
  })).isRequired
};

export default QuotaHistory;