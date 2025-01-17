// src/hooks/useFertilizerAllocation.js
import { fertilizerApi } from '@/api/fertilizerApi';
import { useToast } from '@/components/ui/use-toast';
import { useCallback, useState } from 'react';

export const useFertilizerAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const getFarmerAllocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fertilizerApi.getFarmerAllocations();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllocationDetails = useCallback(async (allocationId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fertilizerApi.getAllocationDetails(allocationId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCollectionStatus = useCallback(async (allocationId, status) => {
    try {
      setLoading(true);
      setError(null);
      await fertilizerApi.updateCollectionStatus(allocationId, status);
      
      toast({
        title: "Status Updated",
        description: "Fertilizer collection status has been updated successfully.",
        variant: "success",
      });
      
      return true;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update collection status.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getAllocationHistory = useCallback(async (year, season) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fertilizerApi.getAllocationHistory(year, season);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getFarmerAllocations,
    getAllocationDetails,
    updateCollectionStatus,
    getAllocationHistory
  };
};

export default useFertilizerAllocation;