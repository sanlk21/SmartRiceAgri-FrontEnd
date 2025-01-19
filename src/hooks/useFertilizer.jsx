import { fertilizerApi } from '@/api/fertilizerApi';
import { useEffect, useState } from 'react';

const useFertilizer = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await fertilizerApi.getMyAllocations();
      console.log("Fetched Allocations:", data);
      setAllocations(data);
    } catch (err) {
      console.error("Error fetching allocations:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  return { allocations, loading, error };
};

export default useFertilizer;
