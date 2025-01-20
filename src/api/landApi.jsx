// src/api/landApi.js
import axios from './axios';

const isCancel = (error) => {
  return error?.name === 'CanceledError' || error?.name === 'AbortError';
};

export const landApi = {
  // Get farmer's lands
  getFarmerLands: async (farmerNic, signal) => {
    if (!farmerNic) {
      throw new Error('Farmer NIC is required');
    }
    
    try {
      console.log('Fetching lands for farmer:', farmerNic);
      const response = await axios.get(`/lands/farmer/${farmerNic}`, {
        signal,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      console.error('Error fetching farmer lands:', error);
      throw error;
    }
  },

  // Register a new land
  registerLand: async (formData, signal) => {
    try {
      const response = await axios.post('/lands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal,
        timeout: 15000
      });
      return response.data;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      console.error('Error registering land:', error);
      throw error;
    }
  },

  // Update land status
  updateLandStatus: async (landId, status, signal) => {
    try {
      const response = await axios.put(`/lands/${landId}/status`, 
        { status },
        { signal, timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      console.error('Error updating land status:', error);
      throw error;
    }
  },

  // Get all lands (admin)
  getAllLands: async (signal) => {
    try {
      const response = await axios.get('/lands', { signal });
      return response.data;
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      console.error('Error fetching all lands:', error);
      throw error;
    }
  }
};