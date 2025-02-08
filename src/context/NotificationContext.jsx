// src/context/NotificationContext.jsx
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/services/notificationService';
import websocketService from '@/services/websocketService';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);

  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    toast({
      title: notification.title,
      description: notification.description,
      duration: 5000,
    });
  }, [toast]);

  useEffect(() => {
    if (user) {
      // Initialize WebSocket connection
      websocketService.connect();
      
      // Fetch initial notifications
      fetchNotifications();

      // Set up polling interval
      const interval = setInterval(fetchNotifications, 30000);

      // Set up WebSocket subscription
      const unsubscribe = websocketService.subscribe('notification', handleNewNotification);

      return () => {
        clearInterval(interval);
        unsubscribe();
        websocketService.disconnect();
      };
    }
  }, [user, fetchNotifications, handleNewNotification]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
    }
  };

  const deleteNotification = async (notificationId) => {
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
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}