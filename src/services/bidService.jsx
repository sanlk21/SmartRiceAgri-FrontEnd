import axios from '../api/axios';

class BidService {
    constructor() {
        this.baseURL = '/api/bids';
    }

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

    async cancelBid(nic) {
        if (!nic) throw new Error('NIC is required');
        try {
            console.log('Cancelling bid for NIC:', nic);
            const response = await axios.post(`${this.baseURL}/${nic}/cancel`);
            console.log('Bid cancelled successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error cancelling bid:', error);
            throw this.handleError(error);
        }
    }

    async getFilteredBids(filters = {}) {
        try {
            console.log('Fetching filtered bids with filters:', filters);
            const response = await axios.get(`${this.baseURL}/active`, { params: filters });
            console.log('Filtered bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered bids:', error);
            throw this.handleError(error);
        }
    }

    async getAllBids() {
        try {
            console.log('Fetching all bids...');
            const response = await axios.get(`${this.baseURL}/admin/all`);
            console.log('All bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching all bids:', error);
            throw this.handleError(error);
        }
    }

    async updateBidStatus(nic, status) {
        if (!nic) throw new Error('NIC is required');
        try {
            console.log('Updating bid status for NIC:', { nic, status });
            const response = await axios.put(`${this.baseURL}/admin/${nic}/status`, null, { params: { status } });
            console.log('Bid status updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating bid status:', error);
            throw this.handleError(error);
        }
    }

    async getFarmerBids(farmerNic) {
        if (!farmerNic) throw new Error('Farmer NIC is required');
        try {
            console.log('Fetching farmer bids for NIC:', farmerNic);
            const response = await axios.get(`/bids/farmer/${farmerNic}`); // Correct path
            console.log('Farmer bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching farmer bids:', error);
            throw this.handleError(error);
        }
    }
    

    async getBuyerWinningBids(buyerNic) {
        if (!buyerNic) throw new Error('Buyer NIC is required');
        try {
            console.log('Fetching buyer winning bids for NIC:', buyerNic);
            const response = await axios.get(`${this.baseURL}/buyer/${buyerNic}/winning`);
            console.log('Buyer winning bids retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching buyer winning bids:', error);
            throw this.handleError(error);
        }
    }

    async getBidDetails(nic) {
        if (!nic) throw new Error('NIC is required');
        try {
            console.log('Fetching bid details for NIC:', nic);
            const response = await axios.get(`${this.baseURL}/farmer/${nic}`);
            if (!response.data) throw new Error('No bid data received');
            console.log('Bid details retrieved successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching bid details:', error);
            throw this.handleError(error);
        }
    }

    async acceptBidOffer(nic, buyerNic) {
        if (!nic || !buyerNic) throw new Error('NIC and Buyer NIC are required');
        try {
            console.log('Accepting bid offer:', { nic, buyerNic });
            const response = await axios.put(`${this.baseURL}/${nic}/accept`, { buyerNic });
            console.log('Bid offer accepted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error accepting bid offer:', error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        console.error('Handling error:', error);

        if (error.response) {
            const { data, status } = error.response;
            return {
                status,
                message: data.message || 'An error occurred while processing your request.',
                details: data.details || [],
            };
        }

        if (error.request) {
            return {
                status: 503,
                message: 'Service unavailable. Please check your network connection.',
                details: [],
            };
        }

        return {
            status: 500,
            message: error.message || 'An unexpected error occurred.',
            details: [],
        };
    }
}

export const bidService = new BidService();
