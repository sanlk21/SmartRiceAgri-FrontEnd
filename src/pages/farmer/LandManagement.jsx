import { landApi } from '@/api/landApi';
import FertilizerCalculationDisplay from '@/components/farmer/land/FertilizerCalculationDisplay';
import LandList from '@/components/farmer/land/LandList';
import LandRegistrationForm from '@/components/farmer/land/LandRegistrationForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';

const LandManagement = () => {
  const [lands, setLands] = useState([]); // State to store lands
  const [selectedLand, setSelectedLand] = useState(null); // State for selected land
  const [loading, setLoading] = useState(true); // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent duplicate submissions
  const { toast } = useToast();
  const { user } = useAuth(); // Get user data from AuthContext
  const fetchInProgress = useRef(false); // Ref to track ongoing fetches
  const abortController = useRef(null); // Ref for AbortController

  // Fetch lands function
  const fetchLands = useCallback(async () => {
    if (!user?.nic || fetchInProgress.current) return;

    if (abortController.current) {
      abortController.current.abort(); // Abort any ongoing fetch
    }

    try {
      fetchInProgress.current = true;
      abortController.current = new AbortController();

      console.log('Fetching lands for farmer:', user.nic);
      const response = await landApi.getFarmerLands(user.nic, abortController.current.signal);
      console.log('Fetched lands:', response);

      setLands(response || []); // Set fetched lands or an empty array
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'CanceledError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching lands:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to fetch lands',
        variant: 'destructive',
      });
    } finally {
      fetchInProgress.current = false;
      setLoading(false);
    }
  }, [user?.nic, toast]);

  // Effect to fetch lands on component mount
  useEffect(() => {
    fetchLands();
    return () => {
      if (abortController.current) {
        abortController.current.abort(); // Abort fetch on unmount
      }
    };
  }, [fetchLands]);

  // Handle land registration
  const handleLandRegistration = async (formData) => {
    if (!user?.nic) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      formData.append('farmerNic', user.nic); // Add farmer NIC to form data
      await landApi.registerLand(formData); // Call API to register land
      toast({
        title: 'Success',
        description: 'Land registered successfully',
      });
      await fetchLands(); // Refresh lands after registration
    } catch (error) {
      console.error('Land registration error:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to register land',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!lands.length) {
    // Render Land Registration Form for new farmers
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Register Your First Land</h1>
        <p className="text-gray-700">You have not registered any lands yet. Please fill out the form below to register your first land.</p>
        <LandRegistrationForm onSubmit={handleLandRegistration} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Land Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section: Form and List */}
        <div className="space-y-6">
          <LandRegistrationForm onSubmit={handleLandRegistration} />
          <LandList lands={lands} onSelect={setSelectedLand} />
        </div>
        {/* Right Section: Selected Land Details */}
        {selectedLand && (
          <FertilizerCalculationDisplay landData={selectedLand} />
        )}
      </div>
    </div>
  );
};

export default LandManagement;
