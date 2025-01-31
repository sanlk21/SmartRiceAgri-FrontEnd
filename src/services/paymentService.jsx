import axios from '@/api/axios';

class PaymentError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

export const paymentService = {
    // Initialize a new payment for an order
    initializePayment: async (orderId, paymentMethod) => {
        try {
            const response = await axios.post('/payments/initialize', {
                orderId,
                paymentMethod
            });
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to initialize payment',
                'INIT_FAILED',
                error.response?.data
            );
        }
    },

    // Process bank transfer payment
    processBankTransfer: async (paymentId, bankTransferData, proofFile) => {
        try {
            const formData = new FormData();
            formData.append('request', new Blob([JSON.stringify(bankTransferData)], { 
                type: 'application/json' 
            }));
            
            if (proofFile) {
                formData.append('proof', proofFile);
            }

            const response = await axios.post(
                `/payments/${paymentId}/bank-transfer`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to process bank transfer',
                'BANK_TRANSFER_FAILED',
                error.response?.data
            );
        }
    },

    // Process cash on delivery payment
    processCashOnDelivery: async (paymentId, deliveryData) => {
        try {
            const response = await axios.post(
                `/payments/${paymentId}/cash-on-delivery`,
                deliveryData
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to process cash on delivery',
                'COD_FAILED',
                error.response?.data
            );
        }
    },

    // Process online payment
    processOnlinePayment: async (paymentId, paymentData) => {
        try {
            const response = await axios.post(
                `/payments/${paymentId}/online-payment`,
                paymentData
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to process online payment',
                'ONLINE_PAYMENT_FAILED',
                error.response?.data
            );
        }
    },

    // Get payment details
    getPayment: async (paymentId) => {
        try {
            const response = await axios.get(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch payment details',
                'FETCH_FAILED',
                error.response?.data
            );
        }
    },

    // Get buyer's payments with pagination and filters
    getBuyerPayments: async (buyerNic, filters = {}) => {
        try {
            const params = new URLSearchParams({
                ...filters,
                status: filters.status || '',
                paymentMethod: filters.paymentMethod || '',
                page: filters.page || 0,
                size: filters.size || 10,
                sort: filters.sort || 'createdAt,desc'
            });

            const response = await axios.get(
                `/payments/buyer/${buyerNic}?${params}`
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch buyer payments',
                'FETCH_BUYER_FAILED',
                error.response?.data
            );
        }
    },

    // Get farmer's payments with pagination and filters
    getFarmerPayments: async (farmerNic, filters = {}) => {
        try {
            const params = new URLSearchParams({
                ...filters,
                status: filters.status || '',
                paymentMethod: filters.paymentMethod || '',
                page: filters.page || 0,
                size: filters.size || 10,
                sort: filters.sort || 'createdAt,desc'
            });

            const response = await axios.get(
                `/payments/farmer/${farmerNic}?${params}`
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch farmer payments',
                'FETCH_FARMER_FAILED',
                error.response?.data
            );
        }
    },

    // Download payment proof document
    downloadPaymentProof: async (paymentId) => {
        try {
            const response = await axios.get(
                `/payments/${paymentId}/proof`,
                {
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to download payment proof',
                'PROOF_DOWNLOAD_FAILED',
                error.response?.data
            );
        }
    },

    // Admin: Get all payments with filters
    getAllPayments: async (filters = {}) => {
        try {
            const params = new URLSearchParams({
                ...filters,
                status: filters.status || '',
                paymentMethod: filters.paymentMethod || '',
                page: filters.page || 0,
                size: filters.size || 10,
                sort: filters.sort || 'createdAt,desc'
            });

            const response = await axios.get(`/payments/admin/all?${params}`);
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch all payments',
                'FETCH_ALL_FAILED',
                error.response?.data
            );
        }
    },

    // Admin: Get payments by status
    getPaymentsByStatus: async (status, filters = {}) => {
        try {
            const params = new URLSearchParams({
                ...filters,
                page: filters.page || 0,
                size: filters.size || 10,
                sort: filters.sort || 'createdAt,desc'
            });

            const response = await axios.get(
                `/payments/admin/status/${status}?${params}`
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch payments by status',
                'FETCH_STATUS_FAILED',
                error.response?.data
            );
        }
    },

    // Admin: Get payment statistics
    getPaymentStatistics: async () => {
        try {
            const response = await axios.get('/payments/admin/statistics');
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to fetch payment statistics',
                'STATS_FAILED',
                error.response?.data
            );
        }
    },

    // Admin: Manually complete a payment
    completePayment: async (paymentId) => {
        try {
            const response = await axios.post(`/payments/admin/${paymentId}/complete`);
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to complete payment',
                'COMPLETE_FAILED',
                error.response?.data
            );
        }
    },

    // Admin: Mark payment as failed
    failPayment: async (paymentId, reason) => {
        try {
            const response = await axios.post(
                `/payments/admin/${paymentId}/fail`,
                null,
                { params: { reason } }
            );
            return response.data;
        } catch (error) {
            throw new PaymentError(
                error.response?.data?.message || 'Failed to mark payment as failed',
                'FAIL_MARKING_FAILED',
                error.response?.data
            );
        }
    }
};

export default paymentService;