import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, CheckCircle, Hash, Map, MapPin, Package, User } from 'lucide-react';

const QuotaDetails = ({ allocation, onMarkCollected }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <div className="space-y-6">
      {/* Current Allocation and Season Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Current Allocation</h3>
            </div>
            <p className="text-3xl font-bold">{allocation?.allocatedAmount || 0} kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Season</h3>
            </div>
            <p className="text-3xl font-bold">{allocation?.season || 'Not specified'} {allocation?.year}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Quota Details</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm ${
              allocation?.status === 'READY' 
                ? 'bg-green-100 text-green-800'
                : allocation?.status === 'COLLECTED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {allocation?.status || 'PENDING'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Farmer Details */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <User className="h-4 w-4" />
                <span className="text-sm">Farmer Details</span>
              </div>
              <p className="text-lg font-semibold pl-6">
                {allocation?.farmerName}
                <span className="text-sm text-gray-500 ml-2">
                  (NIC: {allocation?.farmerNic})
                </span>
              </p>
            </div>

            {/* Land Details */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Map className="h-4 w-4" />
                <span className="text-sm">Land Details</span>
              </div>
              <p className="text-lg font-semibold pl-6">
                {allocation?.landLocation}
                <span className="text-sm text-gray-500 ml-2">
                  ({allocation?.landSize} hectares)
                </span>
              </p>
            </div>

            {/* Distribution Date */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Distribution Date</span>
              </div>
              <p className="text-lg font-semibold pl-6">
                {formatDate(allocation?.distributionDate)}
              </p>
            </div>

            {/* Distribution Location */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Distribution Location</span>
              </div>
              <p className="text-lg font-semibold pl-6">
                {allocation?.distributionLocation || 'Not specified'}
              </p>
            </div>

            {/* Reference Number */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Hash className="h-4 w-4" />
                <span className="text-sm">Reference Number</span>
              </div>
              <p className="text-lg font-semibold pl-6">
                {allocation?.referenceNumber || 'Not assigned'}
              </p>
            </div>

            {/* Collection Status */}
            {allocation?.isCollected && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Collection Details</span>
                </div>
                <p className="text-lg font-semibold pl-6">
                  Collected on {formatDate(allocation?.collectionDate)}
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          {allocation?.status === 'READY' && !allocation?.isCollected && (
            <Button 
              className="w-full mt-6"
              onClick={() => onMarkCollected?.(allocation?.id)}
            >
              Mark as Collected
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotaDetails;