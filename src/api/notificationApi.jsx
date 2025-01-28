// src/api/notificationApi.js
import { notificationService } from '../services/notificationService';

export const notificationApi = {
    getNotifications: async () => {
        try {
            return await notificationService.getMyNotifications();
        } catch (error) {
            throw new Error('Failed to fetch notifications');
        }
    },

    markNotificationAsRead: async (notificationId) => {
        try {
            return await notificationService.markAsRead(notificationId);
        } catch (error) {
            throw new Error('Failed to mark notification as read');
        }
    },

    sendBroadcast: async (broadcastData) => {
        try {
            return await notificationService.createBroadcast(broadcastData);
        } catch (error) {
            throw new Error('Failed to send broadcast');
        }
    },

    getAdminBroadcasts: async () => {
        try {
            return await notificationService.getAllBroadcasts();
        } catch (error) {
            throw new Error('Failed to fetch broadcasts');
        }
    },

    removeNotification: async (notificationId) => {
        try {
            return await notificationService.deleteNotification(notificationId);
        } catch (error) {
            throw new Error('Failed to delete notification');
        }
    }
};