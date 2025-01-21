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

  getStatistics: async () => {
    try {
      const response = await axiosInstance.get('/fertilizer/admin/statistics');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch statistics');
    }
  },

  updateAllocationStatus: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/fertilizer/admin/allocations/${id}/status`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update allocation status');
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

  setDistributionDetails: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/fertilizer/admin/allocations/${id}/distribution`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to set distribution details');
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
  },

  getAllocationsByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`/fertilizer/admin/allocations/status/${status}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch allocations by status');
    }
  },

  // Farmer endpoints
  getMyAllocations: async (nic) => {
    if (!nic) throw new Error('NIC is required');
    try {
      const response = await axiosInstance.get(`/fertilizer/my-allocations/${nic}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch allocations for NIC: ${nic}`);
    }
  },

  getAllocationDetails: async (id) => {
    if (!id) throw new Error('Allocation ID is required');
    try {
      const response = await axiosInstance.get(`/fertilizer/allocations/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch allocation details for ID: ${id}`);
    }
  },

  getAllocationHistory: async (nic, year, season) => {
    if (!nic) throw new Error('NIC is required');
    try {
      const response = await axiosInstance.get(`/fertilizer/history/${nic}`, {
        params: { year, season }
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch allocation history');
    }
  },

  updateCollectionStatus: async (allocationId, nic, status) => {
    try {
      const response = await axiosInstance.put(
        `/fertilizer/allocations/${allocationId}/status/${nic}`, 
        { status }
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to update collection status');
    }
  }
};