// src/api/landApi.js
import axios from './axios';

export const landApi = {
  // Register new land
  registerLand: async (formData) => {
    const response = await axios.post('/lands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get single land details
  getLand: async (landId) => {
    const response = await axios.get(`/lands/${landId}`);
    return response.data;
  },

  // Get farmer's lands by NIC
  getFarmerLands: async (farmerNic) => {
    const response = await axios.get(`/lands/farmer/${farmerNic}`);
    return response.data;
  },

  // Get lands by status
  getLandsByStatus: async (status) => {
    const response = await axios.get(`/lands/status/${status}`);
    return response.data;
  },

  // Get all lands (admin)
  getAllLands: async () => {
    const response = await axios.get('/lands');
    return response.data;
  },

  // Update land status - Changed to send status in request body
  updateLandStatus: async (landId, status) => {
    const response = await axios.put(`/lands/${landId}/status`, {
      status: status
    });
    return response.data;
  }
};