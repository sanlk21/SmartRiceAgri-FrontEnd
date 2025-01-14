// src/api/fertilizerApi.jsx
import axios from './axios';

export const fertilizerApi = {
    // Get farmer's allocations
    getFarmerAllocations: async () => {
        const response = await axios.get('/api/fertilizer/my-allocations');
        return response.data;
    },

    // Get specific allocation details
    getAllocationDetails: async (allocationId) => {
        const response = await axios.get(`/api/fertilizer/allocations/${allocationId}`);
        return response.data;
    },

    // Get seasonal allocation history
    getAllocationHistory: async (year, season) => {
        const response = await axios.get(`/api/fertilizer/history?year=${year}&season=${season}`);
        return response.data;
    },

    // Update collection status
    updateCollectionStatus: async (allocationId, status) => {
        const response = await axios.put(`/api/fertilizer/allocations/${allocationId}/status`, { status });
        return response.data;
    }
};