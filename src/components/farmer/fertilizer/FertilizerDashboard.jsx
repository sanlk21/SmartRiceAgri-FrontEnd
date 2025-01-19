import { fertilizerApi } from '@/api/fertilizerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import AllocationTable from './AllocationTable';

const FarmerFertilizerDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        setLoading(true);
        const data = await fertilizerApi.getMyAllocations();
        setAllocations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  if (loading) {
    return <div className="text-center text-blue-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!allocations.length) {
    return <div className="text-center text-gray-500">No allocations available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Farmer Fertilizer Dashboard</h1>

      {/* Allocation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{allocations.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {allocations.filter((a) => a.status === 'PENDING').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Table */}
      <AllocationTable allocations={allocations} />
    </div>
  );
};

export default FarmerFertilizerDashboard;
