import axios from 'axios';

const handleApiError = (error, customMessage) => {
  console.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
  });

  if (error.code === 'ERR_NETWORK') {
    throw new Error('Cannot connect to server. Please check if the backend is running.');
  }

  const errorMessage = error.response?.data?.message || customMessage;
  throw new Error(errorMessage);
};

export const fertilizerApi = {
  // Fetch allocations for the farmer
  getMyAllocations: async () => {
    try {
      const response = await axios.get('/api/fertilizer/my-allocations'); // Directly use axios
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch your allocations');
    }
  },

  // Fetch allocation history
  getAllocationHistory: async (year, season) => {
    try {
      const response = await axios.get('/api/fertilizer/history', {
        params: { year, season },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch allocation history');
    }
  },

  // Update collection status of an allocation
  updateCollectionStatus: async (allocationId, status) => {
    try {
      const response = await axios.put(`/api/fertilizer/allocations/${allocationId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update collection status');
    }
  },
};

export default fertilizerApi;
