import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useFertilizerOperations } from '@/hooks/useFertilizerOperations';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, MapPin, Package } from 'lucide-react';
import PropTypes from 'prop-types';

const QuotaDetails = ({ quota }) => {
  const { updateCollectionStatus } = useFertilizerOperations();
  const { toast } = useToast();

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

  const handleCollect = async () => {
    try {
      await updateCollectionStatus(quota.id, 'COLLECTED');
      toast({
        title: "Success",
        description: "Quota marked as collected successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update collection status",
        variant: "destructive"
      });
    }
  };

  if (!quota) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            No active quota allocation available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Alert */}
      {quota.status === 'READY' && quota.expiryDate && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please collect your fertilizer allocation before {format(new Date(quota.expiryDate), 'PPP')}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Quota Details</CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(quota.status)}`}>
            {quota.status}
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Allocation Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Allocated Amount</p>
                  <p className="text-sm text-gray-600">{quota.allocatedAmount} kg</p>
                  <p className="text-xs text-gray-500">For {quota.season} Season {quota.year}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Distribution Date</p>
                  <p className="text-sm text-gray-600">
                    {quota.distributionDate 
                      ? format(new Date(quota.distributionDate), 'PPP')
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location and Reference */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">Distribution Location</p>
                  <p className="text-sm text-gray-600">
                    {quota.distributionLocation || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 flex items-center justify-center text-gray-500 mt-1">#</span>
                <div>
                  <p className="font-medium">Reference Number</p>
                  <p className="text-sm text-gray-600">{quota.referenceNumber || 'Not assigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Button */}
          {quota.status === 'READY' && (
            <Button 
              className="w-full mt-6"
              onClick={handleCollect}
            >
              Mark as Collected
            </Button>
          )}

          {/* Collection Confirmation */}
          {quota.status === 'COLLECTED' && quota.collectionDate && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">Collection Confirmed</p>
                  <p className="text-sm text-green-600">
                    Collected on {format(new Date(quota.collectionDate), 'PPP')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

QuotaDetails.propTypes = {
  quota: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.oneOf(['READY', 'PENDING', 'EXPIRED', 'COLLECTED']),
    allocatedAmount: PropTypes.number,
    season: PropTypes.string,
    year: PropTypes.number,
    distributionDate: PropTypes.string,
    distributionLocation: PropTypes.string,
    referenceNumber: PropTypes.string,
    expiryDate: PropTypes.string,
    collectionDate: PropTypes.string
  })
};

export default QuotaDetails;