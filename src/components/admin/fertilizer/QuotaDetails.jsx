import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, MapPin, Package } from 'lucide-react';
import PropTypes from 'prop-types';

const QuotaDetails = ({ quota }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'COLLECTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Fertilizer Quota Details</CardTitle>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(quota?.status)}`}>
          {quota?.status || 'PENDING'}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Allocation Amount */}
          <div className="flex items-start space-x-4">
            <Package className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Allocated Amount</p>
              <p className="text-sm text-gray-600">{quota?.allocatedAmount || 0} kg</p>
            </div>
          </div>

          {/* Distribution Date */}
          <div className="flex items-start space-x-4">
            <Calendar className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Distribution Date</p>
              <p className="text-sm text-gray-600">
                {quota?.distributionDate 
                  ? format(new Date(quota.distributionDate), 'PPP')
                  : 'Not scheduled'}
              </p>
            </div>
          </div>

          {/* Distribution Location */}
          <div className="flex items-start space-x-4">
            <MapPin className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Distribution Location</p>
              <p className="text-sm text-gray-600">{quota?.distributionLocation || 'Not specified'}</p>
            </div>
          </div>

          {/* Reference Number */}
          <div className="flex items-start space-x-4">
            <div className="h-5 w-5 flex items-center justify-center">
              <span className="text-sm font-bold">#</span>
            </div>
            <div>
              <p className="font-medium">Reference Number</p>
              <p className="text-sm text-gray-600">{quota?.referenceNumber || 'N/A'}</p>
            </div>
          </div>

          {/* Expiry Warning */}
          {quota?.status === 'READY' && quota?.expiryDate && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-800">Collection Deadline</p>
                <p className="text-sm text-yellow-600">
                  Please collect before {format(new Date(quota.expiryDate), 'PPP')}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

QuotaDetails.propTypes = {
  quota: PropTypes.shape({
    status: PropTypes.oneOf(['READY', 'PENDING', 'EXPIRED', 'COLLECTED']),
    allocatedAmount: PropTypes.number,
    distributionDate: PropTypes.string,
    distributionLocation: PropTypes.string,
    referenceNumber: PropTypes.string,
    expiryDate: PropTypes.string
  })
};

QuotaDetails.defaultProps = {
  quota: {
    status: 'PENDING',
    allocatedAmount: 0,
    distributionDate: null,
    distributionLocation: '',
    referenceNumber: '',
    expiryDate: null
  }
};

export default QuotaDetails;