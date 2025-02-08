// src/services/notificationService.js

// Remove VITE_API_URL since we're using relative paths with proxy
const BASE_URL = '/api/notifications';

export const NotificationType = {
    BID_PLACED: 'BID_PLACED',
    BID_ACCEPTED: 'BID_ACCEPTED',
    BID_REJECTED: 'BID_REJECTED',
    BID_EXPIRED: 'BID_EXPIRED',
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_STATUS_CHANGE: 'ORDER_STATUS_CHANGE',
    PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
    PAYMENT_REMINDER: 'PAYMENT_REMINDER',
    ADMIN_BROADCAST: 'ADMIN_BROADCAST',
    FERTILIZER_ALLOCATED: 'FERTILIZER_ALLOCATED',
    FERTILIZER_READY: 'FERTILIZER_READY',
    FERTILIZER_COLLECTED: 'FERTILIZER_COLLECTED',
    FERTILIZER_EXPIRED: 'FERTILIZER_EXPIRED'
};

class NotificationService {
    async getMyNotifications() {
        try {
            const response = await fetch(`${BASE_URL}/my`, {
                method: 'GET',
                credentials: 'include',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return []; // Return empty array if no notifications found
                }
                throw new Error('Failed to fetch notifications');
            }

            const text = await response.text(); // First get response as text
            if (!text) return []; // Return empty array if response is empty

            try {
                return JSON.parse(text); // Then try to parse as JSON
            } catch (e) {
                console.error('Error parsing JSON:', text);
                return [];
            }
        } catch (error) {
            console.error('Error in getMyNotifications:', error);
            return []; // Return empty array on error
        }
    }

    async markAsRead(notificationId) {
        try {
            const response = await fetch(`${BASE_URL}/${notificationId}/read`, {
                method: 'PUT',
                credentials: 'include',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error;
        }
    }

    async markAllAsRead() {
        try {
            const response = await fetch(`${BASE_URL}/mark-all-read`, {
                method: 'PUT',
                credentials: 'include',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            const response = await fetch(`${BASE_URL}/${notificationId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('Error in deleteNotification:', error);
            throw error;
        }
    }

    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
    }
}

export const notificationService = new NotificationService();