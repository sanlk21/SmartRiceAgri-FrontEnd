import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react'; // Add icons for scroll buttons and actions
import PropTypes from 'prop-types';
import { useRef } from 'react'; // Add useRef for ScrollArea control
import NotificationItem from './NotificationItem';

const NotificationPanel = ({ notifications, onClose, markAsRead, markAllAsRead, deleteNotification }) => {
  // Reference to the ScrollArea viewport for scrolling control
  const scrollAreaRef = useRef(null);

  // Scroll to top function
  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  // Clear read notifications
  const clearReadNotifications = async () => {
    const readNotificationIds = notifications
      .filter((notification) => notification.read)
      .map((notification) => notification.id);

    if (readNotificationIds.length === 0) {
      return;
    }

    try {
      await Promise.all(readNotificationIds.map((id) => deleteNotification(id)));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  };

  // If no notifications, show a message
  if (!notifications || notifications.length === 0) {
    return (
      <Card className="fixed right-4 top-16 w-96 shadow-lg z-50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed right-4 top-16 w-96 shadow-lg z-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notifications</CardTitle>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark All as Read
              </Button>
            )}
            {notifications.some((n) => n.read) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearReadNotifications}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {/* Scroll Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="rounded-full"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToBottom}
            className="rounded-full"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[50vh] pr-4" ref={scrollAreaRef}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead} // Pass markAsRead to NotificationItem
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// PropTypes for NotificationPanel
NotificationPanel.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      type: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired, // Added read property
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  markAsRead: PropTypes.func.isRequired, // Added prop for marking a notification as read
  markAllAsRead: PropTypes.func.isRequired, // Added prop for marking all notifications as read
  deleteNotification: PropTypes.func.isRequired, // Added prop for deleting a notification
};

export default NotificationPanel;