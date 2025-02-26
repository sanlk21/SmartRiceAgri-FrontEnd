import axios from '@/api/axios';

class NotificationService {
  /**
   * Fetch current user's notifications
   * @returns {Promise<Array>} List of notifications
   */
  async getMyNotifications() {
    try {
      const response = await axios.get('/api/notifications/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  /**
   * Mark a specific notification as read
   * @param {number} notificationId - ID of the notification to mark as read
   * @returns {Promise<Object>} Response data
   */
  async markAsRead(notificationId) {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read for current user
   * @returns {Promise<Object>} Response data
   */
  async markAllAsRead() {
    try {
      const response = await axios.put('/api/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Delete a notification
   * @param {number} notificationId - ID of the notification to delete
   * @returns {Promise<void>}
   */
  async deleteNotification(notificationId) {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Create a broadcast notification (visible to all users)
   * @param {Object} data - Broadcast data with title and description
   * @returns {Promise<Object>} Created notification data
   */
  async createBroadcast(data) {
    try {
      const response = await axios.post('/api/notifications/broadcast', data);
      return response.data;
    } catch (error) {
      console.error('Error creating broadcast:', error);
      throw new Error('Failed to create broadcast: ' + (error.response?.data?.error || error.message));
    }
  }

  /**
   * Create a targeted notification for a specific user
   * @param {Object} data - Notification data including recipient, type, etc.
   * @returns {Promise<Object>} Created notification data
   */
  async createNotification(data) {
    try {
      if (!data.title || !data.description) {
        throw new Error('Notification title and description are required');
      }

      const response = await axios.post('/api/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification: ' + (error.response?.data?.error || error.message));
    }
  }

  /**
   * Get all broadcast notifications (admin only)
   * @returns {Promise<Array>} List of broadcast notifications
   */
  async getAllBroadcasts() {
    try {
      const response = await axios.get('/api/notifications/broadcasts');
      return response.data;
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      throw new Error('Failed to fetch broadcasts');
    }
  }

  /**
   * Count unread notifications for the current user
   * @returns {Promise<number>} Number of unread notifications
   */
  async getUnreadCount() {
    try {
      const notifications = await this.getMyNotifications();
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return 0; // Return 0 on error to avoid breaking the UI
    }
  }

  /**
   * Create a notification related to a bid event
   * @param {Object} data - Notification data including bidId, type, etc.
   * @returns {Promise<Object>} Created notification data
   */
  async createBidNotification(data) {
    if (!data.bidId) {
      throw new Error('Bid ID is required');
    }
    return this.createNotification(data);
  }

  /**
   * Create a notification related to an order event
   * @param {Object} data - Notification data including orderId, type, etc.
   * @returns {Promise<Object>} Created notification data
   */
  async createOrderNotification(data) {
    if (!data.orderId) {
      throw new Error('Order ID is required');
    }
    return this.createNotification(data);
  }
}

export const notificationService = new NotificationService();