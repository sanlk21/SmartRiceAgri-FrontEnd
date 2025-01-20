import { landApi } from '@/api/landApi';
import LandList from '@/components/farmer/land/LandList';
import LandRegistrationForm from '@/components/farmer/land/LandRegistrationForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext'; // Import the auth context
import { useCallback, useEffect, useState } from 'react';

const LandManagement = () => {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();  // Get the current user

  const fetchLands = useCallback(async () => {
    if (!user?.nic) {
      console.log('No user NIC available');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching lands for farmer:', user.nic);
      const response = await landApi.getFarmerLands(user.nic);
      console.log('Fetched lands:', response);
      setLands(response);
    } catch (error) {
      console.error('Error fetching lands:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user?.nic]);

  useEffect(() => {
    fetchLands();
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

    // Add the farmer NIC to the form data
    formData.append("farmerNic", user.nic);

    try {
      await landApi.registerLand(formData);
      toast({
        title: "Success",
        description: "Land registered successfully",
      });
      fetchLands(); // Refresh the land list
    } catch (error) {
      console.error('Land registration error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register land",
        variant: "destructive",
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