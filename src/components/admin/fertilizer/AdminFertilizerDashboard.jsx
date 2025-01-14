import { adminFertilizerApi } from '@/api/adminFertilizerApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Calendar, Package, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AllocationList from './AllocationList';
import AllocationStats from './AllocationStats';
import CreateAllocationForm from './CreateAllocationForm';

const AdminFertilizerDashboard = () => {
  const [allocations, setAllocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Memoized fetchData to avoid useEffect dependency warnings
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [allocationsData, statsData] = await Promise.all([
        adminFertilizerApi.getAllAllocations(page),
        adminFertilizerApi.getAllocationStats(),
      ]);
      setAllocations(allocationsData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateAllocation = async (data) => {
    try {
      await adminFertilizerApi.createAllocation(data);
      setShowCreateForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
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
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allocations</p>
                <p className="text-2xl font-bold">{stats?.totalAllocations || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Collections</p>
                <p className="text-2xl font-bold">{stats?.pendingCollections || 0}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Season</p>
                <p className="text-2xl font-bold">{stats?.currentSeasonAllocations || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Allocation Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Allocation
        </button>
      </div>

      {/* Create Allocation Form Modal */}
      {showCreateForm && (
        <CreateAllocationForm
          onSubmit={handleCreateAllocation}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Allocations List */}
      <AllocationList
        allocations={allocations}
        onPageChange={setPage}
        currentPage={page}
      />

      {/* Statistics Charts */}
      <AllocationStats stats={stats} />
    </div>
  );
};

export default AdminFertilizerDashboard;
