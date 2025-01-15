// src/services/PaymentIntegrationService.js
import axios from 'axios';

// Use import.meta.env for Vite projects
const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8080/api/payments';

class PaymentIntegrationService {
    constructor() {
        this.api = axios.create({
            baseURL: PAYMENT_API_URL,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    async initializePayment(paymentData) {
        try {
            const response = await this.api.post('/initialize', {
                orderId: paymentData.orderId,
                amount: paymentData.amount,
                currency: 'LKR',
                paymentMethod: paymentData.paymentMethod,
                description: `Payment for Bid ${paymentData.bidId}`,
                metadata: {
                    bidId: paymentData.bidId,
                    buyerId: paymentData.buyerId,
                    sellerId: paymentData.sellerId,
                }
            });

            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async processCardPayment(paymentDetails) {
        try {
            const response = await this.api.post('/card', {
                paymentIntentId: paymentDetails.paymentIntentId,
                cardDetails: {
                    number: paymentDetails.cardNumber,
                    expiryMonth: paymentDetails.expiryMonth,
                    expiryYear: paymentDetails.expiryYear,
                    cvc: paymentDetails.cvc
                },
                amount: paymentDetails.amount,
                currency: 'LKR'
            });

            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async processBankTransfer(transferDetails) {
        try {
            const response = await this.api.post('/bank-transfer', {
                paymentIntentId: transferDetails.paymentIntentId,
                bankDetails: {
                    accountNumber: transferDetails.accountNumber,
                    bankCode: transferDetails.bankCode,
                    accountName: transferDetails.accountName
                },
                amount: transferDetails.amount,
                currency: 'LKR'
            });

            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async verifyPayment(paymentId) {
        try {
            const response = await this.api.get(`/${paymentId}/verify`);
            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async getPaymentStatus(paymentId) {
        try {
            const response = await this.api.get(`/${paymentId}/status`);
            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async refundPayment(paymentId, refundData) {
        try {
            const response = await this.api.post(`/${paymentId}/refund`, {
                amount: refundData.amount,
                reason: refundData.reason,
                metadata: refundData.metadata
            });

            return response.data;
        } catch (error) {
            throw this.handlePaymentError(error);
        }
    }

    async handlePaymentWebhook(event) {
        try {
            const eventType = event.type;
            const paymentId = event.data.id;

            switch (eventType) {
                case 'payment.succeeded':
                    await this.handlePaymentSuccess(paymentId, event.data);
                    break;
                case 'payment.failed':
                    await this.handlePaymentFailure(paymentId, event.data);
                    break;
                case 'payment.refunded':
                    await this.handlePaymentRefund(paymentId, event.data);
                    break;
                default:
                    console.log(`Unhandled payment event type: ${eventType}`);
            }
        } catch (error) {
            console.error('Error handling payment webhook:', error);
            throw this.handlePaymentError(error);
        }
    }

    async handlePaymentSuccess(paymentId, paymentData) {
        try {
            // Update order status
            await this.updateOrderStatus(paymentId, 'PAID');
            
            // Send confirmation emails
            await this.sendPaymentConfirmation(paymentData);
            
            // Update bid status
            await this.updateBidStatus(paymentData.metadata.bidId, 'COMPLETED');

            return { success: true, paymentId };
        } catch (error) {
            console.error('Error handling payment success:', error);
            throw this.handlePaymentError(error);
        }
    }

    async handlePaymentFailure(paymentId, paymentData) {
        try {
            // Update payment status
            await this.updatePaymentStatus(paymentId, 'FAILED');
            
            // Send failure notification
            await this.notifyPaymentFailure(paymentData);
            
            // Handle retry if applicable
            if (this.isRetryable(paymentData)) {
                await this.schedulePaymentRetry(paymentId);
            }

            return { success: false, paymentId };
        } catch (error) {
            console.error('Error handling payment failure:', error);
            throw this.handlePaymentError(error);
        }
    }

    async handlePaymentRefund(paymentId, paymentData) {
        try {
            // Process refund
            await this.processRefund(paymentId, paymentData);
            
            // Update order status
            await this.updateOrderStatus(paymentId, 'REFUNDED');
            
            // Send notifications
            await this.sendRefundNotification(paymentData);

            return { success: true, paymentId };
        } catch (error) {
            console.error('Error handling payment refund:', error);
            throw this.handlePaymentError(error);
        }
    }

    // Helper methods
    handlePaymentError(error) {
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    return new Error('Invalid payment details');
                case 401:
                    return new Error('Payment authentication failed');
                case 402:
                    return new Error('Payment failed');
                case 404:
                    return new Error('Payment not found');
                default:
                    return new Error(data.message || 'Payment processing error');
            }
        }
        return new Error('Payment service unavailable');
    }

    async updateOrderStatus(paymentId, status) {
        const response = await this.api.put(`/orders/${paymentId}/status`, { status });
        return response.data;
    }

    async updateBidStatus(bidId, status) {
        const response = await this.api.put(`/bids/${bidId}/status`, { status });
        return response.data;
    }

    async updatePaymentStatus(paymentId, status) {
        const response = await this.api.put(`/${paymentId}/status`, { status });
        return response.data;
    }

    async sendPaymentConfirmation(paymentData) {
        const response = await this.api.post('/notifications/payment-confirmation', paymentData);
        return response.data;
    }

    async notifyPaymentFailure(paymentData) {
        const response = await this.api.post('/notifications/payment-failure', paymentData);
        return response.data;
    }

    async sendRefundNotification(paymentData) {
        const response = await this.api.post('/notifications/refund', paymentData);
        return response.data;
    }

    isRetryable(paymentData) {
        return paymentData.attemptCount < 3 && 
               !paymentData.isExpired &&
               paymentData.errorType === 'TEMPORARY';
    }

    async schedulePaymentRetry(paymentId) {
        const response = await this.api.post(`/${paymentId}/retry`);
        return response.data;
    }

    async processRefund(paymentId, paymentData) {
        const response = await this.api.post(`/${paymentId}/process-refund`, paymentData);
        return response.data;
    }
}

export default new PaymentIntegrationService();