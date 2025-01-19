import axios from 'axios';

const BASE_URL = '/api'; // Ensure your Vite proxy is correctly configured to forward `/api` to the backend.

export const adminFertilizerApi = {
  // Fetch allocation statistics
  getAllocationStats: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fertilizer/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching allocation statistics:', error);
      throw error;
    }
  },

  // Fetch all allocations with pagination
  getAllAllocations: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/fertilizer/admin/allocations`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all allocations:', error);
      throw error;
    }
  },

  // Fetch seasonal allocations
  getSeasonalAllocations: async (season, year) => {
    try {
      const response = await axios.get(`${BASE_URL}/fertilizer/admin/seasonal`, {
        params: { season, year },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seasonal allocations:', error);
      throw error;
    }
  },

  // Create a new allocation
  createAllocation: async (allocationData) => {
    try {
      const response = await axios.post(`${BASE_URL}/fertilizer/admin/allocations`, allocationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating allocation:', error);
      throw error;
    }
  },

  // Update an allocation
  updateAllocation: async (id, allocationData) => {
    try {
      const response = await axios.put(`${BASE_URL}/fertilizer/admin/allocations/${id}`, allocationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating allocation:', error);
      throw error;
    }
  },

  // Set distribution details
  setDistributionDetails: async (id, distributionData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/fertilizer/admin/allocations/${id}/distribution`,
        distributionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting distribution details:', error);
      throw error;
    }
  },

  // Fetch allocations by status
  getAllocationsByStatus: async (status) => {
    try {
      const response = await axios.get(`${BASE_URL}/fertilizer/admin/allocations/status/${status}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching allocations by status:', error);
      throw error;
    }
  },
};

export default adminFertilizerApi;
