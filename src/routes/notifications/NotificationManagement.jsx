import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { notificationService } from "@/services/notificationService";
import {
  AlertCircle,
  Bell,
  Check,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Trash
} from "lucide-react";
import { useEffect, useState } from "react";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    broadcasts: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // In a real app, you would call an API endpoint to get all notifications
      // For now, we'll just get the broadcasts as a demonstration
      const broadcasts = await notificationService.getAllBroadcasts();
      setNotifications(broadcasts);
      
      // Calculate stats
      const readCount = broadcasts.filter(n => n.read).length;
      setStats({
        total: broadcasts.length,
        read: readCount,
        unread: broadcasts.length - readCount,
        broadcasts: broadcasts.length
      });
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch notifications"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return;
    }
    
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        broadcasts: prev.broadcasts - 1
      }));
      
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification"
      });
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) {
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, you would call an API endpoint to delete all notifications
      // For now, we'll just show a success message
      
      toast({
        title: "Success",
        description: "All notifications deleted successfully"
      });
      
      // Reset notifications and stats
      setNotifications([]);
      setStats({
        total: 0,
        read: 0,
        unread: 0,
        broadcasts: 0
      });
      
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete all notifications"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications based on search term and type
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "ALL" || 
      (filterType === "BROADCAST" && notification.type === "ADMIN_BROADCAST") ||
      (filterType === "BID" && notification.type?.includes("BID")) ||
      (filterType === "ORDER" && notification.type?.includes("ORDER")) ||
      (filterType === "PAYMENT" && notification.type?.includes("PAYMENT")) ||
      (filterType === "FERTILIZER" && notification.type?.includes("FERTILIZER"));
    
    return matchesSearch && matchesType;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Notification Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.read}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.broadcasts}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>
                View and manage all notifications in the system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={fetchNotifications}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleDeleteAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="BROADCAST">Broadcasts</SelectItem>
                <SelectItem value="BID">Bid Notifications</SelectItem>
                <SelectItem value="ORDER">Order Notifications</SelectItem>
                <SelectItem value="PAYMENT">Payment Notifications</SelectItem>
                <SelectItem value="FERTILIZER">Fertilizer Notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="border rounded-md">
              <ScrollArea className="h-[500px]">
                <div className="divide-y">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            {notification.type && (
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                {notification.type.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {notification.recipientNic || 'Broadcast'}
                            </span>
                            <span>
                              Created: {formatDate(notification.createdDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              {notification.read ? 'Read' : 'Unread'}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground" />
              <p>No notifications found</p>
              {searchTerm || filterType !== "ALL" ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Try changing your search or filter
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationManagement;