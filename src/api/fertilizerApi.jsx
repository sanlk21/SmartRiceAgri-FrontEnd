import axios from './axios';

const handleApiError = (error, customMessage) => {
  const errorMessage = error.response?.data?.message || customMessage;
  console.error(errorMessage, error);
  throw new Error(errorMessage);
};

export const fertilizerApi = {
    // Farmer endpoints
    getMyAllocations: async () => {
        try {
            const response = await axios.get('/api/fertilizer/my-allocations');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch allocations');
        }
    },

    getAllocationDetails: async (allocationId) => {
        try {
            const response = await axios.get(`/api/fertilizer/allocations/${allocationId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch allocation details');
        }
    },

    getAllocationHistory: async (year, season) => {
        try {
            const response = await axios.get('/api/fertilizer/history', {
                params: { year, season }
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch allocation history');
        }
    },

    updateCollectionStatus: async (allocationId, status) => {
        try {
            const response = await axios.patch(
                `/api/fertilizer/allocations/${allocationId}/status`,
                { status }
            );
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to update collection status');
        }
    },

    // Admin endpoints
    getAllAllocations: async (page = 0, size = 10) => {
        try {
            const response = await axios.get('/api/fertilizer/admin/allocations', {
                params: { page, size }
            });
            return {
                content: response.data.content || [],
                totalPages: response.data.totalPages || 0,
                totalElements: response.data.totalElements || 0,
                currentPage: page
            };
        } catch (error) {
            handleApiError(error, 'Failed to fetch allocations');
        }
    },

    createAllocation: async (allocationData) => {
        try {
            const response = await axios.post('/api/fertilizer/admin/allocations', allocationData);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to create allocation');
        }
    },

    updateAllocation: async (id, allocationData) => {
        try {
            const response = await axios.put(`/api/fertilizer/admin/allocations/${id}`, allocationData);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to update allocation');
        }
    },

    getStatistics: async () => {
        try {
            const response = await axios.get('/api/fertilizer/admin/statistics');
            return {
                totalAllocations: response.data.totalAllocations || 0,
                totalAmount: response.data.totalAmount || 0,
                collectedAmount: response.data.collectedAmount || 0,
                currentSeasonAmount: response.data.currentSeasonAmount || 0
            };
        } catch (error) {
            handleApiError(error, 'Failed to fetch statistics');
        }
    },

    getSeasonalAllocations: async (season, year) => {
        try {
            const response = await axios.get('/api/fertilizer/admin/seasonal', {
                params: { season, year }
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to fetch seasonal allocations');
        }
    },

    setDistributionDetails: async (id, distributionData) => {
        try {
            const response = await axios.put(
                `/api/fertilizer/admin/allocations/${id}/distribution`,
                distributionData
            );
            return response.data;
        } catch (error) {
            handleApiError(error, 'Failed to set distribution details');
        }
    },

    getAllocationsByStatus: async (status, page = 0, size = 10) => {
        try {
            const response = await axios.get(`/api/fertilizer/admin/allocations/status/${status}`, {
                params: { page, size }
            });
            return {
                content: response.data.content || [],
                totalPages: response.data.totalPages || 0,
                totalElements: response.data.totalElements || 0,
                currentPage: page
            };
        } catch (error) {
            handleApiError(error, 'Failed to fetch allocations by status');
        }
    }
};