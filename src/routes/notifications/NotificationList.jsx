import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDown, ArrowUp, Bell, Check, Trash2, X } from 'lucide-react'; // Add icons for scroll buttons and actions
import { useRef } from 'react'; // Add useRef for ScrollArea control

const NotificationList = () => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead } = useNotifications();

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
            {notifications.some((notification) => notification.read) && (
              <Button
                variant="outline"
                onClick={clearReadNotifications}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Read
              </Button>
            )}
          </div>
        )}
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

        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-muted/50' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            NEW
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdDate), {
                          addSuffix: true,
                        })}
                      </p>
                      {notification.type && (
                        <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {notification.type.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationList;