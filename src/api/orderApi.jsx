import axios from './axios';

const BASE_URL = '/api/orders';

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    throw new Error('No response from server');
  } else {
    throw new Error('Error setting up request');
  }
};

export const orderApi = {
  createOrder: async (bidId, buyerNic, farmerNic, quantity, pricePerKg) => {
    try {
      const response = await axios.post(BASE_URL, {
        bidId,
        buyerNic,
        farmerNic,
        quantity,
        pricePerKg
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePayment: async (orderId, paymentDetails) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${orderId}/payment`, 
        paymentDetails
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getBuyerOrders: async (buyerNic) => {
    try {
      const response = await axios.get(`${BASE_URL}/buyer/${buyerNic}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getFarmerOrders: async (farmerNic) => {
    try {
      const response = await axios.get(`${BASE_URL}/farmer/${farmerNic}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/all`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getOrderStatistics: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/statistics`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/${orderId}/status`, 
        { status }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  downloadReceipt: async (orderId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${orderId}/receipt`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  cancelOrder: async (orderId, reason) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${orderId}/cancel`, 
        { reason }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export default orderApi;