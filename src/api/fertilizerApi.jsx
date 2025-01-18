// src/api/fertilizerApi.js
import axios from './axios';

export const fertilizerApi = {
    // Farmer endpoints
    getMyAllocations: async () => {
        const response = await axios.get('/api/fertilizer/my-allocations');
        return response.data;
    },

    getAllocationDetails: async (allocationId) => {
        const response = await axios.get(`/api/fertilizer/allocations/${allocationId}`);
        return response.data;
    },

    getAllocationHistory: async (year, season) => {
        const response = await axios.get('/api/fertilizer/history', {
            params: { year, season }
        });
        return response.data;
    },

    updateCollectionStatus: async (allocationId, status) => {
        const response = await axios.put(
            `/api/fertilizer/allocations/${allocationId}/status`,
            { status }
        );
        return response.data;
    },

    // Admin endpoints
    getAllAllocations: async (page = 0, size = 10) => {
        const response = await axios.get('/api/fertilizer/admin/allocations', {
            params: { page, size }
        });
        return response.data;
    },

    createAllocation: async (allocationData) => {
        const response = await axios.post('/api/fertilizer/admin/allocations', allocationData);
        return response.data;
    },

    updateAllocation: async (id, allocationData) => {
        const response = await axios.put(`/api/fertilizer/admin/allocations/${id}`, allocationData);
        return response.data;
    },

    getStatistics: async () => {
        const response = await axios.get('/api/fertilizer/admin/statistics');
        return response.data;
    },

    getSeasonalAllocations: async (season, year) => {
        const response = await axios.get('/api/fertilizer/admin/seasonal', {
            params: { season, year }
        });
        return response.data;
    },

    setDistributionDetails: async (id, distributionData) => {
        const response = await axios.put(
            `/api/fertilizer/admin/allocations/${id}/distribution`,
            distributionData
        );
        return response.data;
    },

    getAllocationsByStatus: async (status) => {
        const response = await axios.get(`/api/fertilizer/admin/allocations/status/${status}`);
        return response.data;
    }
};