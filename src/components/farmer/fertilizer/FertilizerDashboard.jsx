// src/components/farmer/fertilizer/FertilizerDashboard.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useFertilizer } from '@/hooks/useFertilizer';
import { Calendar, Package } from 'lucide-react';
import { useEffect, useRef } from 'react';
import QuotaDetails from './QuotaDetails';

const FertilizerDashboard = () => {
  const { user } = useAuth();
  const { allocations, loading, error, fetchAllocations } = useFertilizer();
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (user?.nic && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchAllocations(user.nic);
    }
  }, [user?.nic, fetchAllocations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const currentQuota = allocations?.[0] || null;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Fertilizer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Current Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {currentQuota ? `${currentQuota.allocatedAmount} kg` : 'No active quota'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Season
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {currentQuota ? `${currentQuota.season} ${currentQuota.year}` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {currentQuota && <QuotaDetails quota={currentQuota} />}
    </div>
  );
};

export default FertilizerDashboard;