// src/context/NotificationContext.jsx
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/services/notificationService';
import websocketService from '@/services/websocketService';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Create context with default values
const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: () => Promise.resolve(),
  markAsRead: () => Promise.resolve(),
  markAllAsRead: () => Promise.resolve(),
  deleteNotification: () => Promise.resolve()
});

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await notificationService.getMyNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const handleNewNotification = useCallback((notification) => {
    if (!notification) return;

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    toast({
      title: notification.title,
      description: notification.description,
      duration: 5000,
    });
  }, [toast]);

  useEffect(() => {
    let interval;
    let wsUnsubscribe;

    if (user) {
      // Initial fetch
      fetchNotifications();

      // Setup polling
      interval = setInterval(fetchNotifications, 30000);

      // Setup WebSocket
      websocketService.connect();
      wsUnsubscribe = websocketService.subscribe('notification', handleNewNotification);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (wsUnsubscribe) wsUnsubscribe();
      websocketService.disconnect();
    };
  }, [user, fetchNotifications, handleNewNotification]);

  const markAsRead = async (notificationId) => {
    if (!notificationId) return;

    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!notificationId) return;

    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      if (!notifications.find(n => n.id === notificationId)?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Export the context for testing purposes
export const NotificationContextTest = NotificationContext;