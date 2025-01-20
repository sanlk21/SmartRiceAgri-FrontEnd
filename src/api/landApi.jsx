// src/api/landApi.js
import axios from 'axios';
import axiosInstance from './axios';

const CACHE_KEY = 'farmer_lands_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const landApi = {
  getFarmerLands: async (farmerNic, signal) => {
    if (!farmerNic) {
      throw new Error('Farmer NIC is required');
    }

    try {
      // Check cache first
      const cacheKey = `${CACHE_KEY}${farmerNic}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
        sessionStorage.removeItem(cacheKey); // Clear expired cache
      }

      const response = await axiosInstance.get(`/lands/farmer/${farmerNic}`, {
        signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      // Cache the successful response
      if (response.data) {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
      }

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      throw error;
    }
  },

  registerLand: async (formData, signal) => {
    try {
      const response = await axiosInstance.post('/lands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        }
      });

      // Clear cache after successful registration
      const cacheKey = `${CACHE_KEY}${formData.get('farmerNic')}`;
      sessionStorage.removeItem(cacheKey);

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      throw error;
    }
  },

  updateLandStatus: async (landId, status, signal) => {
    try {
      const response = await axiosInstance.put(`/lands/${landId}/status`, 
        { status },
        { signal }
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      throw error;
    }
  },

  getAllLands: async (signal) => {
    try {
      const response = await axiosInstance.get('/lands', { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
        throw error;
      }
      throw error;
    }
  }
};