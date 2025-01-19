import { fertilizerApi } from '@/api/fertilizerApi';
import { useCallback, useEffect, useState } from 'react';

const useFertilizer = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllocations = useCallback(async (retryCount = 3) => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getMyAllocations();
      console.log("Fetched Allocations:", data);
      setAllocations(data);
    } catch (err) {
      if (retryCount > 0) {
        console.warn("Retrying fetchAllocations...");
        fetchAllocations(retryCount - 1);
      } else {
        console.error("Error fetching allocations:", {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures the function doesn't change

  useEffect(() => {
    fetchAllocations(); // Safe to call as its reference won't change
  }, [fetchAllocations]); // Include fetchAllocations in the dependency array

  return { allocations, loading, error };
};

export default useFertilizer;
