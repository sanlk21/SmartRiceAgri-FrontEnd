import { landApi } from '@/api/landApi';
import AdminLandList from '@/components/admin/land/AdminLandList';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, MapPin, User, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const LandAdministration = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const { toast } = useToast();

  const fetchLands = useCallback(async () => {
    try {
      const response = await landApi.getAllLands();
      // Convert id to string and calculate stats
      const transformedLands = response.map((land) => ({
        ...land,
        id: String(land.id), // Ensure id is a string
      }));
      setLands(transformedLands);
      calculateStats(transformedLands);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch lands',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const calculateStats = useCallback((landsData) => {
    const newStats = {
      total: landsData.length,
      pending: landsData.filter((land) => land.status === 'PENDING').length,
      approved: landsData.filter((land) => land.status === 'APPROVED').length,
      rejected: landsData.filter((land) => land.status === 'REJECTED').length,
    };
    setStats(newStats);
  }, []);

  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  const handleStatusUpdate = async (landId, newStatus) => {
    try {
      await landApi.updateLandStatus(landId, newStatus);
      toast({
        title: 'Success',
        description: `Land status updated to ${newStatus}`,
      });
      fetchLands(); // Refresh the data after update
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update land status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Land Administration</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lands</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <User className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Land List */}
      <AdminLandList lands={lands} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default LandAdministration;
