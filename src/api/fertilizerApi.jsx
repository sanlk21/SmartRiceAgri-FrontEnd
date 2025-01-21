// src/api/fertilizerApi.js
import axiosInstance from './axios';

const handleApiError = (error, customMessage) => {
  console.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
  });

  const errorMessage = error.response?.data?.message || customMessage;
  throw new Error(errorMessage || 'An error occurred');
};

export const fertilizerApi = {
  // Fetch allocations for the farmer
  getMyAllocations: async (nic) => {
    if (!nic) {
      throw new Error('NIC is required');
    }

    try {
      console.log('Fetching allocations for NIC:', nic); // Debug log
      const response = await axiosInstance.get(`/fertilizer/my-allocations/${nic}`, {
        timeout: 30000, // Increase timeout for this specific request
        retry: 3, // Add retry attempts
        retryDelay: 1000 // Delay between retries
      });
      return response.data;
    } catch (error) {
      console.error('Get allocations error:', error);
      if (!error.response) {
        throw new Error('Network error - please check your connection');
      }
      handleApiError(error, `Failed to fetch allocations for NIC: ${nic}`);
    }
  },

  // Fetch allocation history
  getAllocationHistory: async (nic, year, season) => {
    if (!nic) {
      throw new Error('NIC is required');
    }

    try {
      const response = await axiosInstance.get(`/fertilizer/history/${nic}`, {
        params: { year, season }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch allocation history');
    }
  },

  // Get allocation details
  getAllocationDetails: async (id) => {
    if (!id) {
      throw new Error('Allocation ID is required');
    }

    try {
      const response = await axiosInstance.get(`/fertilizer/allocations/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch allocation details for ID: ${id}`);
    }
  },

  // Update collection status
  updateCollectionStatus: async (allocationId, nic, status) => {
    if (!allocationId || !nic || !status) {
      throw new Error('Allocation ID, NIC, and status are required');
    }

    try {
      const response = await axiosInstance.put(
        `/fertilizer/allocations/${allocationId}/status/${nic}`,
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
      const response = await axiosInstance.get('/fertilizer/admin/allocations', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch all allocations');
    }
  },

  createAllocation: async (data) => {
    try {
      const response = await axiosInstance.post('/fertilizer/admin/allocations', data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to create allocation');
    }
  },

  updateAllocation: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/fertilizer/admin/allocations/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update allocation');
    }
  },

  getStatistics: async () => {
    try {
      const response = await axiosInstance.get('/fertilizer/admin/statistics');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch statistics');
    }
  },

  getSeasonalAllocations: async (season, year) => {
    try {
      const response = await axiosInstance.get('/fertilizer/admin/seasonal', {
        params: { season, year }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch seasonal allocations');
    }
  }
};

// Axios retry configuration
axiosInstance.interceptors.response.use(null, async error => {
  const { config } = error;
  if (!config || !config.retry) return Promise.reject(error);

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }

  config.retryCount += 1;

  const delayRetry = new Promise(resolve => {
    setTimeout(resolve, config.retryDelay || 1000);
  });

  await delayRetry;
  return axiosInstance(config);
});

export default fertilizerApi;