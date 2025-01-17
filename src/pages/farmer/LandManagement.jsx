// src/pages/farmer/LandManagement.jsx
import { landApi } from '@/api/landApi';
import FertilizerCalculationDisplay from '@/components/farmer/land/FertilizerCalculationDisplay';
import LandList from '@/components/farmer/land/LandList';
import LandRegistrationForm from '@/components/farmer/land/LandRegistrationForm';
import { useToast } from '@/components/ui/use-toast';
import { useCallback, useEffect, useState } from 'react';

const LandManagement = () => {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLands = useCallback(async () => {
    try {
      const response = await landApi.getFarmerLands();
      setLands(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lands",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  const handleLandRegistration = async (formData) => {
    try {
      await landApi.registerLand(formData);
      toast({
        title: "Success",
        description: "Land registered successfully",
      });
      fetchLands();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to register land",
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