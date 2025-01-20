import { landApi } from '@/api/landApi';
import FertilizerCalculationDisplay from '@/components/farmer/land/FertilizerCalculationDisplay';
import LandList from '@/components/farmer/land/LandList';
import LandRegistrationForm from '@/components/farmer/land/LandRegistrationForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';

const LandManagement = () => {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const fetchInProgress = useRef(false);
  const abortController = useRef(null);

  const fetchLands = useCallback(async () => {
    if (!user?.nic || fetchInProgress.current) return;

    if (abortController.current) {
      abortController.current.abort();
    }

    try {
      fetchInProgress.current = true;
      abortController.current = new AbortController();

      console.log('Fetching lands for farmer:', user.nic);
      const response = await landApi.getFarmerLands(user.nic, abortController.current.signal);
      console.log('Fetched lands:', response);
      
      setLands(response || []);
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'CanceledError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching lands:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to fetch lands",
        variant: "destructive",
      });
    } finally {
      fetchInProgress.current = false;
      setLoading(false);
    }
  }, [user?.nic, toast]);

  useEffect(() => {
    fetchLands();
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [fetchLands]);

  const handleLandRegistration = async (formData) => {
    if (!user?.nic) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    const controller = new AbortController();

    try {
      formData.append("farmerNic", user.nic);
      await landApi.registerLand(formData, controller.signal);
      toast({
        title: "Success",
        description: "Land registered successfully",
      });
      await fetchLands();
    } catch (error) {
      if (!error?.name?.includes('Cancel')) {
        console.error('Land registration error:', error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to register land",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Land Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <LandRegistrationForm onSubmit={handleLandRegistration} />
          <LandList 
            lands={lands} 
            onSelect={setSelectedLand}
          />
        </div>
        {selectedLand && (
          <FertilizerCalculationDisplay landData={selectedLand} />
        )}
      </div>
    </div>
  );
};

export default LandManagement;