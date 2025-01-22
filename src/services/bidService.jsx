
import axios from '../api/axios';

class BidService {
    constructor() {
        this.baseURL = '/api/bids';
    }

    validateBidId(bidId) {
        const numericId = Number(bidId);
        if (isNaN(numericId) || numericId <= 0) {
            throw new Error('Invalid bid ID format');
        }
        return numericId;
    }

    // Create new bid (Farmer only)
    async createBid(bidCreateRequest) {
        try {
            console.log('Creating bid:', bidCreateRequest);
            const response = await axios.post(this.baseURL, bidCreateRequest);
            console.log('Bid created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating bid:', error);
            throw this.handleError(error);
        }
    }

    // Place a bid offer (Buyer only)
    async placeBid(bidOfferRequest) {
        try {
            console.log('Placing bid offer:', bidOfferRequest);
            const response = await axios.post(`${this.baseURL}/offer`, bidOfferRequest);
            console.log('Bid offer placed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error placing bid offer:', error);
            throw this.handleError(error);
        }
    }

    // Cancel bid
    async cancelBid(bidId) {
        try {
            const validatedId = this.validateBidId(bidId);
            console.log('Cancelling bid:', validatedId);
            const response = await axios.post(`${this.baseURL}/${validatedId}/cancel`);
            console.log('Bid cancelled successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error cancelling bid:', error);
            throw this.handleError(error);
        }
    }

    // Get filtered and sorted active bids
    async getFilteredBids(filters = {}) {
        try {
            console.log('Getting filtered bids with params:', filters);
            const params = new URLSearchParams();
            
            if (filters.riceVariety) params.append('riceVariety', filters.riceVariety);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.location) params.append('location', filters.location);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

            const response = await axios.get(`${this.baseURL}/active`, { params });
            console.log('Filtered bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting filtered bids:', error);
            throw this.handleError(error);
        }
    }

    // Get all bids (Admin only)
    async getAllBids() {
        try {
            console.log('Getting all bids');
            const response = await axios.get(`${this.baseURL}/admin/all`);
            console.log('All bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting all bids:', error);
            throw this.handleError(error);
        }
    }

    // Update bid status (Admin only)
    async updateBidStatus(bidId, status) {
        try {
            const validatedId = this.validateBidId(bidId);
            console.log('Updating bid status:', { bidId: validatedId, status });
            const response = await axios.put(`${this.baseURL}/admin/${validatedId}/status`, null, {
                params: { status }
            });
            console.log('Bid status updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating bid status:', error);
            throw this.handleError(error);
        }
    }

    // Force complete bid (Admin only)
    async forceCompleteBid(bidId, buyerNic, amount) {
        try {
            const validatedId = this.validateBidId(bidId);
            console.log('Force completing bid:', { bidId: validatedId, buyerNic, amount });
            const response = await axios.put(
                `${this.baseURL}/admin/${validatedId}/force-complete`,
                null,
                { params: { buyerNic, amount } }
            );
            console.log('Bid force completed successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error force completing bid:', error);
            throw this.handleError(error);
        }
    }

    // Get bid statistics (Admin only)
    async getBidStatistics() {
        try {
            console.log('Getting bid statistics');
            const response = await axios.get(`${this.baseURL}/admin/statistics`);
            console.log('Bid statistics retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting bid statistics:', error);
            throw this.handleError(error);
        }
    }

    // Get farmer's bids
    async getFarmerBids(farmerNic) {
        try {
            if (!farmerNic) throw new Error('Farmer NIC is required');
            console.log('Getting farmer bids for:', farmerNic);
            const response = await axios.get(`${this.baseURL}/farmer/${farmerNic}`);
            console.log('Farmer bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting farmer bids:', error);
            throw this.handleError(error);
        }
    }

    // Get buyer's winning bids
    async getBuyerWinningBids(buyerNic) {
        try {
            if (!buyerNic) throw new Error('Buyer NIC is required');
            console.log('Getting buyer winning bids for:', buyerNic);
            const response = await axios.get(`${this.baseURL}/buyer/${buyerNic}/winning`);
            console.log('Buyer winning bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting buyer winning bids:', error);
            throw this.handleError(error);
        }
    }

    // Get single bid details
    async getBidDetails(bidId) {
        if (!bidId) {
            throw new Error('Bid ID is required');
        }

        try {
            const validatedId = this.validateBidId(bidId);
            console.log('Getting bid details for ID:', validatedId);
            const response = await axios.get(`${this.baseURL}/${validatedId}`);
            
            if (!response.data) {
                throw new Error('No bid data received');
            }
            
            console.log('Bid details retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting bid details:', error);
            throw this.handleError(error);
        }
    }

    // Accept bid offer
    async acceptBidOffer(bidId, buyerNic) {
        try {
            if (!bidId || !buyerNic) {
                throw new Error('Bid ID and buyer NIC are required');
            }

            const validatedId = this.validateBidId(bidId);
            console.log('Accepting bid offer:', { bidId: validatedId, buyerNic });
            const response = await axios.put(`${this.baseURL}/${validatedId}/accept`, { buyerNic });
            console.log('Bid offer accepted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error accepting bid offer:', error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('Full error details:', error);

        // If it's already our custom error format, return it
        if (error.status && error.message) {
            return error;
        }

        if (error.response) {
            const errorData = error.response.data;
            const status = error.response.status;

            // Handle Spring conversion errors
            if (errorData.message?.includes('Failed to convert')) {
                return {
                    status: 400,
                    message: 'Invalid bid ID format',
                    details: [errorData.message]
                };
            }

            // Handle validation errors
            if (status === 400 && errorData.message?.includes('validation')) {
                return {
                    status: 400,
                    message: 'Validation error',
                    details: errorData.details || [errorData.message]
                };
            }

            // Handle other response errors
            return {
                status: status,
                message: errorData.message || this.getDefaultErrorMessage(status),
                details: errorData.details || []
            };
        }

        // Handle network errors
        if (error.request) {
            return {
                status: 503,
                message: 'Service unavailable. Please check your connection and try again.',
                details: ['No response received from server']
            };
        }

        // Handle other errors
        return {
            status: 500,
            message: error.message || 'An unexpected error occurred',
            details: []
        };
    }

    getDefaultErrorMessage(status) {
        const messages = {
            400: 'Invalid request. Please check your input.',
            401: 'Unauthorized. Please log in again.',
            403: 'Access denied. You do not have permission to perform this action.',
            404: 'Bid not found.',
            409: 'Conflict with existing data.',
            422: 'Invalid data provided.',
            500: 'Server error. Please try again later.'
        };
        
        return messages[status] || 'An unexpected error occurred.';
    }
}

export const bidService = new BidService();