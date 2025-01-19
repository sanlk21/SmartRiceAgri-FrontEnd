// src/components/admin/fertilizer/AdminFertilizerDashboard.jsx
import { fertilizerApi } from '@/api/fertilizerApi';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import StatCard from '@/components/fertilizer/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Package, TrendingUp, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AllocationList from '../../../components/admin/fertilizer/AllocationList';
import CreateAllocationForm from '../../../components/admin/fertilizer/CreateAllocationForm';

const AdminFertilizerDashboard = () => {
  const [stats, setStats] = useState({
    totalAllocations: 0,
    totalAmount: 0,
    collectedAmount: 0,
    currentSeasonAmount: 0
  });
  const [allocations, setAllocations] = useState({ content: [], totalPages: 0 });
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
        description: error.message,
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
        description: "Allocation created successfully"
      });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Allocations"
          value={stats.totalAllocations}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Total Amount"
          value={`${stats.totalAmount} kg`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Collected"
          value={`${stats.collectedAmount} kg`}
          icon={Users}
          color="yellow"
        />
        <StatCard
          title="This Season"
          value={`${stats.currentSeasonAmount} kg`}
          icon={Calendar}
          color="purple"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Allocation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <AllocationList 
            allocations={allocations.content}
            currentPage={currentPage}
            totalPages={allocations.totalPages}
            onPageChange={setCurrentPage}
            onRefresh={fetchData}
          />
        </CardContent>
      </Card>

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