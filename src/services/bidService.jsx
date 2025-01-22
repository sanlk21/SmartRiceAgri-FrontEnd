import axios from '../api/axios';

class BidService {
    constructor() {
        this.baseURL = '/bids';
    }

    async getFilteredBids(filters = {}) {
        try {
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value && value !== 'ALL' && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await axios.get(`${this.baseURL}/active`, { params: cleanFilters });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createBid(bidCreateRequest) {
        try {
            const response = await axios.post(this.baseURL, bidCreateRequest);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async placeBid(bidOfferRequest) {
        try {
            const response = await axios.post(`${this.baseURL}/offer`, bidOfferRequest);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async cancelBid(bidId) {
        try {
            const response = await axios.post(`${this.baseURL}/${bidId}/cancel`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getAllBids() {
        try {
            const response = await axios.get(`${this.baseURL}/admin/all`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateBidStatus(bidId, status) {
        try {
            const response = await axios.put(`${this.baseURL}/admin/${bidId}/status`, null, {
                params: { status }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async forceCompleteBid(bidId, buyerNic, amount) {
        try {
            const response = await axios.put(`${this.baseURL}/admin/${bidId}/force-complete`, null, {
                params: { buyerNic, amount }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBidStatistics() {
        try {
            const response = await axios.get(`${this.baseURL}/admin/statistics`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getFarmerBids(farmerNic) {
        try {
            const response = await axios.get(`${this.baseURL}/farmer/${farmerNic}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBuyerWinningBids(buyerNic) {
        try {
            const response = await axios.get(`${this.baseURL}/buyer/${buyerNic}/winning`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getBidDetails(bidId) {
        try {
            const response = await axios.get(`${this.baseURL}/${bidId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async acceptBidOffer(bidId, buyerNic) {
        try {
            const response = await axios.put(`${this.baseURL}/${bidId}/accept`, { buyerNic });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API Error:', error.response || error);
        
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || 'Request failed',
                details: error.response.data?.details || []
            };
        }

        if (error.code === 'ERR_NETWORK') {
            return {
                status: 503,
                message: 'Cannot connect to server. Please check your connection.',
                details: []
            };
        }

        if (error.code === 'ECONNABORTED') {
            return {
                status: 408,
                message: 'Request timeout - please try again.',
                details: []
            };
        }

        return {
            status: 500,
            message: error.message || 'An unexpected error occurred.',
            details: []
        };
    }
}

export const bidService = new BidService();