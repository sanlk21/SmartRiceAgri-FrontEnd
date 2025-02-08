// src/services/notificationService.js

//const BASE_URL = '/api/notifications';

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
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/my`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getMyNotifications:', error);
            return [];
        }
    }

    async createNotification(data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to create notification');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in createNotification:', error);
            throw error;
        }
    }

    async createBroadcast(data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/broadcast`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create broadcast');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in createBroadcast:', error);
            throw error;
        }
    }

    async getAllBroadcasts() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/broadcasts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch broadcasts');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in getAllBroadcasts:', error);
            return [];
        }
    }

    async deleteNotification(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            return true;
        } catch (error) {
            console.error('Error in deleteNotification:', error);
            throw error;
        }
    }
}

export const notificationService = new NotificationService();