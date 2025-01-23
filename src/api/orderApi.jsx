// src/api/orderApi.js
import axiosInstance from './axios';

const BASE_URL = '/orders';

export const orderApi = {
  getFarmerOrders: async (farmerNic) => {
    const response = await axiosInstance.get(`${BASE_URL}/farmer/${farmerNic}`);
    return response.data;
  },

  getBuyerOrders: async (buyerNic) => {
    const response = await axiosInstance.get(`${BASE_URL}/buyer/${buyerNic}`);
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await axiosInstance.get(`${BASE_URL}/${orderId}`);
    return response.data;
  },

  updatePayment: async (orderId, paymentDetails) => {
    const response = await axiosInstance.post(`${BASE_URL}/${orderId}/payment`, paymentDetails);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(`${BASE_URL}/admin/${orderId}/status`, { status });
    return response.data;
  },

  // Admin endpoints
  getAllOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/admin/all`);
    return response.data;
  },

  getOrderStatistics: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/admin/statistics`);
    return response.data;
  }
};

export default orderApi;