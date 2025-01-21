// src/hooks/useFertilizer.jsx
import { fertilizerApi } from '@/api/fertilizerApi';
import { useFertilizer as useContext } from '@/context/FertilizerContext';
import { useCallback } from 'react';

export const useFertilizer = () => {
  const context = useContext();
  const {
    setLoading,
    setError,
    setAllocations,
    setCurrentQuota,
  } = context;

  const fetchAllocations = useCallback(async (nic) => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getMyAllocations(nic);
      setAllocations(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAllocations]);

  const fetchQuotaDetails = useCallback(async (quotaId) => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getAllocationDetails(quotaId);
      setCurrentQuota(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCurrentQuota]);

  return {
    ...context,
    fetchAllocations,
    fetchQuotaDetails,
  };
};

export default useFertilizer;