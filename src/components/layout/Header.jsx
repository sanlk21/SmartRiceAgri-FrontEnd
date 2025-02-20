import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, LogOut, User } from 'lucide-react';
import React from 'react';

const NotificationItem = ({ notification, onRead }) => (
  <div 
    className={`p-4 border-b last:border-0 ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
    onClick={() => !notification.read && onRead(notification.id)}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-medium text-sm text-green-600">{notification.title}</p>
        <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
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
  const { notifications, markAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <ScrollArea className="h-[32rem]">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onRead={markAsRead}
        />
      ))}
    </ScrollArea>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

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
            <Sheet>
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
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <NotificationPanel />
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