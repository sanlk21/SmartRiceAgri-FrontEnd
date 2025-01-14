// src/services/bidService.js
import axios from 'axios';

const BASE_URL = '/api/bids';

export const bidService = {
    // Farmer Operations
    createBid: async (bidData) => {
        const response = await axios.post(BASE_URL, bidData);
        return response.data;
    },

    getFarmerBids: async () => {
        const response = await axios.get(`${BASE_URL}/farmer`);
        return response.data;
    },

    cancelBid: async (bidId) => {
        const response = await axios.post(`${BASE_URL}/${bidId}/cancel`);
        return response.data;
    },

    // Buyer Operations
    getAvailableBids: async (filters) => {
        const response = await axios.get(`${BASE_URL}/available`, { params: filters });
        return response.data;
    },

    placeBid: async (bidId, bidAmount) => {
        const response = await axios.post(`${BASE_URL}/${bidId}/offer`, { bidAmount });
        return response.data;
    },

    getBuyerWinningBids: async () => {
        const response = await axios.get(`${BASE_URL}/buyer/winning`);
        return response.data;
    },

    // Common Operations
    getBidDetails: async (bidId) => {
        const response = await axios.get(`${BASE_URL}/${bidId}`);
        return response.data;
    },

    getBidStatistics: async () => {
        const response = await axios.get(`${BASE_URL}/statistics`);
        return response.data;
    }
};