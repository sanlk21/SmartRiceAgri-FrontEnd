import { adminFertilizerApi } from '@/api/adminFertilizerApi';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const AdminFertilizerDashboard = () => {
  const [stats, setStats] = useState({
    totalAllocations: 0,
    collectedCount: 0,
    pendingCount: 0,
    expiredCount: 0,
  });
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await adminFertilizerApi.getAllocationStats();
      const allocationsResponse = await adminFertilizerApi.getAllAllocations();
      setStats(statsResponse);
      setAllocations(allocationsResponse.content || []);
    } catch (error) {
      console.error('Error fetching allocation statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Fertilizer Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allocations</p>
                <p className="text-2xl font-bold">{stats.totalAllocations}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold">{stats.collectedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">{stats.expiredCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Fertilizer Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          {allocations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th>Farmer NIC</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation) => (
                  <tr key={allocation.id}>
                    <td>{allocation.farmerNic}</td>
                    <td>{allocation.allocatedAmount} kg</td>
                    <td>{allocation.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No allocations found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFertilizerDashboard;
