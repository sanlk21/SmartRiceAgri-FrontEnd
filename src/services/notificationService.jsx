// src/services/notificationService.js

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

export const Priority = {
    MEDIUM: 'MEDIUM'
};

class NotificationService {
    async getMyNotifications() {
        try {
            const response = await fetch(`${BASE_URL}/my`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch notifications');
            return await response.json();
        } catch (error) {
            console.error('Error in getMyNotifications:', error);
            throw error;
        }
    }

    async markAsRead(notificationId) {
        try {
            const response = await fetch(`${BASE_URL}/${notificationId}/read`, {
                method: 'PUT',
                headers: this.getHeaders()
            });
            if (!response.ok) throw new Error('Failed to mark notification as read');
            return await response.json();
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error;
        }
    }

    async createNotification(data) {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create notification');
            return await response.json();
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    async createBroadcast(data) {
        try {
            const response = await fetch(`${BASE_URL}/broadcast`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create broadcast');
            return await response.json();
        } catch (error) {
            console.error('Error in createBroadcast:', error);
            throw error;
        }
    }

    async getAllBroadcasts() {
        try {
            const response = await fetch(`${BASE_URL}/broadcasts`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch broadcasts');
            return await response.json();
        } catch (error) {
            console.error('Error in getAllBroadcasts:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            const response = await fetch(`${BASE_URL}/${notificationId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            if (!response.ok) throw new Error('Failed to delete notification');
            return await response.json();
        } catch (error) {
            console.error('Error in deleteNotification:', error);
            throw error;
        }
    }

    getHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }
}

export const notificationService = new NotificationService();