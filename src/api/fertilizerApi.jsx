import axios from './axios';

const handleApiError = (error, customMessage) => {
  console.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url
  });

  if (error.code === 'ERR_NETWORK') {
    throw new Error('Cannot connect to server. Please check if the backend is running.');
  }

  const errorMessage = error.response?.data?.message || customMessage;
  throw new Error(errorMessage);
};

export const fertilizerApi = {
  // Admin endpoints
  getAllAllocations: async (page = 0, size = 10) => {
    try {
      const response = await axios.get('/fertilizer/admin/allocations', {
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

  getStatistics: async () => {
    try {
      const response = await axios.get('/fertilizer/admin/statistics');
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

  createAllocation: async (allocationData) => {
    try {
      const response = await axios.post('/fertilizer/admin/allocations', allocationData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create allocation');
    }
  },

  updateAllocation: async (id, allocationData) => {
    try {
      const response = await axios.put(`/fertilizer/admin/allocations/${id}`, allocationData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update allocation');
    }
  },

  getSeasonalAllocations: async (season, year) => {
    try {
      const response = await axios.get('/fertilizer/admin/seasonal', {
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
        `/fertilizer/admin/allocations/${id}/distribution`,
        distributionData
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to set distribution details');
    }
  },

  getAllocationsByStatus: async (status) => {
    try {
      const response = await axios.get(`/fertilizer/admin/allocations/status/${status}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch allocations by status');
    }
  },

  // Farmer endpoints
  getMyAllocations: async () => {
    try {
      const response = await axios.get('/fertilizer/my-allocations');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch your allocations');
    }
  },

  getAllocationHistory: async (year, season) => {
    try {
      const response = await axios.get('/fertilizer/history', {
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
        `/fertilizer/allocations/${allocationId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update collection status');
    }
  }
};

export default fertilizerApi;