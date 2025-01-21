import { fertilizerApi } from '@/api/fertilizerApi';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const AdminFertilizerDashboard = () => {
  const [stats, setStats] = useState({
    totalAllocations: 0,
    collectedCount: 0,
    pendingCount: 0,
    expiredCount: 0,
    activeFarmers: 0,
    currentSeason: '',
    collectionRate: 0
  });
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // First try to get statistics
      const statsResponse = await fertilizerApi.getStatistics();
      setStats(statsResponse);

      // Then get allocations based on selected status
      let allocationsResponse;
      if (selectedStatus === 'ALL') {
        allocationsResponse = await fertilizerApi.getAllAllocations();
      } else {
        allocationsResponse = await fertilizerApi.getAllocationsByStatus(selectedStatus);
        // Convert to same format as paginated response
        allocationsResponse = { content: allocationsResponse };
      }
      
      setAllocations(allocationsResponse.content || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await fertilizerApi.updateAllocationStatus(id, { status: newStatus });
      
      // Optimistically update the local state
      setAllocations(prevAllocations => 
        prevAllocations.map(allocation => 
          allocation.id === id 
            ? { ...allocation, status: newStatus }
            : allocation
        )
      );
      
      // Refresh statistics
      const statsResponse = await fertilizerApi.getStatistics();
      setStats(statsResponse);
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
      fetchData(); // Refresh all data on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Fertilizer Dashboard</h1>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="READY">Ready</option>
          <option value="COLLECTED">Collected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => setSelectedStatus('ALL')}>
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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => setSelectedStatus('COLLECTED')}>
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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => setSelectedStatus('PENDING')}>
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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => setSelectedStatus('EXPIRED')}>
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

      <Card>
        <CardHeader>
          <CardTitle>Fertilizer Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          {allocations && allocations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Farmer NIC</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allocations.map((allocation) => (
                  <tr key={allocation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allocation.farmerNic}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.allocatedAmount} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={allocation.status}
                        onChange={(e) => handleStatusChange(allocation.id, e.target.value)}
                        className="px-2 py-1 border rounded mr-2"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="READY">Ready</option>
                        <option value="COLLECTED">Collected</option>
                        <option value="EXPIRED">Expired</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4 text-gray-500">
              No allocations found for the selected status.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFertilizerDashboard;