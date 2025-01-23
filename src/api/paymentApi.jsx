import axios from './axios';

export const paymentApi = {
    // Initialize payment
    initializePayment: async (orderId, paymentMethod) => {
        const response = await axios.post('/payments/initialize', {
            orderId,
            paymentMethod
        });
        return response.data;
    },

    // Bank transfer payment
    processBankTransfer: async (paymentId, data, proofFile) => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
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
    },

    // Cash on delivery payment
    processCashOnDelivery: async (paymentId, deliveryData) => {
        const response = await axios.post(
            `/payments/${paymentId}/cash-on-delivery`,
            deliveryData
        );
        return response.data;
    },

    // Online payment
    processOnlinePayment: async (paymentId, paymentData) => {
        const response = await axios.post(
            `/payments/${paymentId}/online-payment`,
            paymentData
        );
        return response.data;
    },

    // Get payment by ID
    getPayment: async (paymentId) => {
        const response = await axios.get(`/payments/${paymentId}`);
        return response.data;
    },

    // Get buyer payments
    getBuyerPayments: async (buyerNic) => {
        const response = await axios.get(`/payments/buyer/${buyerNic}`);
        return response.data;
    },

    // Get farmer payments
    getFarmerPayments: async (farmerNic) => {
        const response = await axios.get(`/payments/farmer/${farmerNic}`);
        return response.data;
    },

    // Get payment proof document
    getPaymentProof: async (paymentId) => {
        const response = await axios.get(
            `/api/payments/${paymentId}/proof`,
            { responseType: 'blob' }
        );
        return response.data;
    }
};