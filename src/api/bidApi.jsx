// src/services/bidApi.js
import axios from 'axios';

const BASE_URL = '/api/bids';

class BidService {
    // Farmer: Create new bid
    async createBid(bidData) {
        try {
            const response = await axios.post(BASE_URL, bidData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Buyer: Place bid offer
    async placeBidOffer(bidOfferData) {
        try {
            const response = await axios.post(`${BASE_URL}/offer`, bidOfferData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Farmer: Cancel bid
    async cancelBid(bidId) {
        try {
            const response = await axios.post(`${BASE_URL}/${bidId}/cancel`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get filtered active bids
    async getFilteredBids(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.riceVariety) params.append('riceVariety', filters.riceVariety);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.location) params.append('location', filters.location);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

            const response = await axios.get(`${BASE_URL}/active`, { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get single bid details
    async getBidDetails(bidId) {
        try {
            const response = await axios.get(`${BASE_URL}/${bidId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get farmer's bids
    async getFarmerBids(farmerNic) {
        try {
            const response = await axios.get(`${BASE_URL}/farmer/${farmerNic}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get buyer's winning bids
    async getBuyerWinningBids(buyerNic) {
        try {
            const response = await axios.get(`${BASE_URL}/buyer/${buyerNic}/winning`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Admin: Get all bids
    async getAllBids() {
        try {
            const response = await axios.get(`${BASE_URL}/admin/all`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Admin: Update bid status
    async updateBidStatus(bidId, status) {
        try {
            const response = await axios.put(
                `${BASE_URL}/admin/${bidId}/status`,
                null,
                { params: { status } }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Admin: Force complete bid
    async forceCompleteBid(bidId, buyerNic, amount) {
        try {
            const response = await axios.put(
                `${BASE_URL}/admin/${bidId}/force-complete`,
                null,
                { params: { buyerNic, amount } }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Admin: Get bid statistics
    async getBidStatistics() {
        try {
            const response = await axios.get(`${BASE_URL}/admin/statistics`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    handleError(error) {
        if (error.response) {
            // Server responded with error
            const errorData = error.response.data;
            return {
                status: error.response.status,
                message: errorData.message || 'An error occurred',
                details: errorData.details || []
            };
        }
        // Network error or other issues
        return {
            status: 500,
            message: 'Network error or server is unavailable',
            details: []
        };
    }
}

export const bidService = new BidService();