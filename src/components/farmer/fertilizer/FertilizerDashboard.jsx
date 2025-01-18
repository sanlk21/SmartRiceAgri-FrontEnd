import { fertilizerApi } from '@/api/fertilizerApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Calendar, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

const FarmerFertilizerDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [currentAllocation, setCurrentAllocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getMyAllocations();
      setAllocations(data);
      
      // Set current allocation (if any)
      const current = data.find(a => a.status === 'READY');
      setCurrentAllocation(current || null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch allocations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (allocationId) => {
    try {
      await fertilizerApi.updateCollectionStatus(allocationId, 'COLLECTED');
      toast({
        title: "Success",
        description: "Fertilizer marked as collected",
        variant: "success"
      });
      fetchAllocations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Allocation */}
      {currentAllocation && (
        <Card className="bg-white">
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
                <p className="text-lg font-semibold">{currentAllocation.allocatedAmount} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Distribution Location</p>
                <p className="text-lg font-semibold">{currentAllocation.distributionLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="text-lg font-semibold">{currentAllocation.referenceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Until</p>
                <p className="text-lg font-semibold">
                  {format(new Date(currentAllocation.distributionDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <Button 
              className="mt-4 w-full"
              onClick={() => handleCollect(currentAllocation.id)}
            >
              Mark as Collected
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Allocation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
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

export default FarmerFertilizerDashboard;