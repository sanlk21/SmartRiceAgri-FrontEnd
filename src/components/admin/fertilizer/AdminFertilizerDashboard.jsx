import { fertilizerApi } from '@/api/fertilizerApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Package, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AllocationList from './AllocationList'; // Changed from AllocationTable to AllocationList
import CreateAllocationForm from './CreateAllocationForm';

const AdminFertilizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, allocationsData] = await Promise.all([
        fertilizerApi.getStatistics(),
        fertilizerApi.getAllAllocations(currentPage)
      ]);
      setStats(statsData);
      setAllocations(allocationsData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateAllocation = async (data) => {
    try {
      await fertilizerApi.createAllocation(data);
      toast({
        title: "Success",
        description: "Allocation created successfully",
        variant: "success"
      });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create allocation",
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">{stats?.totalAmount || 0} kg</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold">{stats?.collectedAmount || 0} kg</p>
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
                <p className="text-2xl font-bold">{stats?.currentSeasonAmount || 0} kg</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Allocation Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Allocation
        </Button>
      </div>

      {/* Allocations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <AllocationList 
            allocations={allocations} 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRefresh={fetchData}
          />
        </CardContent>
      </Card>

      {/* Create Allocation Modal */}
      {showCreateModal && (
        <CreateAllocationForm
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAllocation}
        />
      )}
    </div>
  );
};

export default AdminFertilizerDashboard;