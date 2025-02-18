import axios from '@/api/axios';

class NotificationService {
  async getMyNotifications() {
    try {
      const response = await axios.get('/api/notifications/my');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllAsRead() {
    try {
      const response = await axios.put('/api/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId) {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
  }

  async createBroadcast(data) {
    try {
      const response = await axios.post('/api/notifications/broadcast', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create broadcast');
    }
  }
}

export const notificationService = new NotificationService();