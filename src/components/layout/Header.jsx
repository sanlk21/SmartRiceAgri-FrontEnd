import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { notificationService } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onRead }) => (
  <div 
    className={`p-4 border-b last:border-0 ${notification.read ? 'bg-gray-50' : 'bg-white'} cursor-pointer`}
    onClick={() => !notification.read && onRead(notification.id)}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-medium text-sm text-green-600">{notification.title}</p>
        <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
        {notification.type && (
          <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {notification.type.replace(/_/g, ' ')}
          </span>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdDate), { addSuffix: true })}
        </p>
      </div>
      {!notification.read && (
        <Badge variant="default" className="ml-2">New</Badge>
      )}
    </div>
  </div>
);

const NotificationPanel = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewAll = () => {
    const basePath = user?.role?.toLowerCase() || 'admin';
    navigate(`/${basePath}/notifications`);
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <span className="text-sm text-gray-500">
          You have {notifications.filter(n => !n.read).length} unread notifications
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800"
        >
          <Check className="h-4 w-4 mr-1" />
          Mark all read
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            onRead={markAsRead}
          />
        ))}
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewAll}
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications when the sheet is opened
  useEffect(() => {
    if (isSheetOpen) {
      // Force refresh notifications
      const fetchNotifications = async () => {
        try {
          await notificationService.getMyNotifications();
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      
      fetchNotifications();
    }
  }, [isSheetOpen]);

  // Navigate to the notification management for admins
  const goToNotificationManagement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user?.role === 'ADMIN') {
      navigate('/admin/notifications/manage');
      setIsSheetOpen(false); // Close the sheet
    }
  };

  // Navigate to create notification for admins
  const goToCreateNotification = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user?.role === 'ADMIN') {
      navigate('/admin/notifications/broadcast');
      setIsSheetOpen(false); // Close the sheet
    }
  };

  return (
    <header className="bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-green-500">
              {user?.role === 'FARMER' && 'Farmer Dashboard'}
              {user?.role === 'BUYER' && 'Buyer Dashboard'}
              {user?.role === 'ADMIN' && 'Admin Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-sky-400" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col">
                <SheetHeader className="flex justify-between items-center">
                  <SheetTitle>Notifications</SheetTitle>
                  {user?.role === 'ADMIN' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goToCreateNotification}
                      >
                        Create
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goToNotificationManagement}
                      >
                        Manage
                      </Button>
                    </div>
                  )}
                </SheetHeader>
                <div className="flex-1 mt-4">
                  <NotificationPanel />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  {user?.fullName}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;