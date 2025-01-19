import { fertilizerApi } from '@/api/fertilizerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useEffect, useState } from 'react';

const FarmerFertilizerDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllocations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getMyAllocations();
      setAllocations(data || []);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!allocations.length) {
    return <div>No allocations available</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Fertilizer Allocations</h1>
      {allocations.map((allocation) => (
        <Card key={allocation.id}>
          <CardHeader>
            <CardTitle>{allocation.season} - {allocation.year}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Allocated Amount: {allocation.allocatedAmount} kg</p>
            <p>Status: {allocation.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FarmerFertilizerDashboard;
