import { fertilizerApi } from '@/api/fertilizerApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { AlertTriangle, CalendarDays, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

const FertilizerDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getFarmerAllocations();
      setAllocations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>;
  }

  if (error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>;
  }

  return (
    <div className="space-y-6">
      {/* Current Allocation */}
      {allocations.filter(a => a.status === 'READY').map(allocation => (
        <Card key={allocation.id} className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Fertilizer Ready for Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount Allocated</p>
                <p className="text-lg font-semibold">{allocation.allocatedAmount} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distribution Location</p>
                <p className="text-lg font-semibold">{allocation.distributionLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="text-lg font-semibold">{allocation.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Until</p>
                <p className="text-lg font-semibold">
                  {format(new Date(allocation.distributionDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Allocation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Recent Allocations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {allocations.map(allocation => (
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
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    allocation.status === 'COLLECTED' 
                      ? 'bg-green-100 text-green-800'
                      : allocation.status === 'EXPIRED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {allocation.status}
                  </span>
                </div>
                {allocation.collectionDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Collected on: {format(new Date(allocation.collectionDate), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FertilizerDashboard;
