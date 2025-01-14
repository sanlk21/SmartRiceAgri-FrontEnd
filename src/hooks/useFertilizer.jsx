// src/hooks/useFertilizer.jsx
import { fertilizerApi } from '@/api/fertilizerApi';
import { useEffect, useState } from 'react';

export const useFertilizer = () => {
    const [allocations, setAllocations] = useState([]);
    const [currentAllocation, setCurrentAllocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllocations = async () => {
        try {
            setLoading(true);
            const data = await fertilizerApi.getFarmerAllocations();
            setAllocations(data);
            
            // Set current allocation (if any)
            const current = data.find(a => a.status === 'READY');
            setCurrentAllocation(current || null);
            
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateCollectionStatus = async (allocationId, status) => {
        try {
            await fertilizerApi.updateCollectionStatus(allocationId, status);
            await fetchAllocations(); // Refresh data
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchAllocations();
    }, []);

    return {
        allocations,
        currentAllocation,
        loading,
        error,
        refreshAllocations: fetchAllocations,
        updateCollectionStatus
    };
};