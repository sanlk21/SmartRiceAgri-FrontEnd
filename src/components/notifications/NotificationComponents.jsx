import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';
import { Bell, LogOut, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              } shadow-sm`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdDate).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="bg-blue-500">
                    New
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await notificationService.getMyNotifications();
      setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.role === 'FARMER' && 'Farmer Dashboard'}
              {user?.role === 'BUYER' && 'Buyer Dashboard'}
              {user?.role === 'ADMIN' && 'Admin Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <NotificationPanel />
              </SheetContent>
            </Sheet>

            <div className="relative flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;