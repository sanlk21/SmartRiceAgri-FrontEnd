// src/api/adminFertilizerApi.jsx
import axios from './axios';

export const adminFertilizerApi = {
    // Get all allocations
    getAllAllocations: async (page = 0, size = 10) => {
        const response = await axios.get(`/api/admin/fertilizer/allocations?page=${page}&size=${size}`);
        return response.data;
    },

    // Create new allocation
    createAllocation: async (allocationData) => {
        const response = await axios.post('/api/admin/fertilizer/allocations', allocationData);
        return response.data;
    },

    // Update allocation
    updateAllocation: async (id, allocationData) => {
        const response = await axios.put(`/api/admin/fertilizer/allocations/${id}`, allocationData);
        return response.data;
    },

    // Get allocation statistics
    getAllocationStats: async () => {
        const response = await axios.get('/api/admin/fertilizer/statistics');
        return response.data;
    },

    // Get seasonal allocations
    getSeasonalAllocations: async (season, year) => {
        const response = await axios.get(`/api/admin/fertilizer/seasonal?season=${season}&year=${year}`);
        return response.data;
    }
};