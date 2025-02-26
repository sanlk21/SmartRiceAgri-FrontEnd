import axios from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Bell, Loader2, RefreshCw, Send, Trash } from "lucide-react";
import { useEffect, useState } from "react";

const AdminBroadcast = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipientType: 'broadcast',
    recipientNic: '',
    notificationType: 'ADMIN_BROADCAST',
    priority: 'MEDIUM',
  });

  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("broadcast");
  const { toast } = useToast();

  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    broadcasts: 0
  });

  const notificationTypes = [
    { value: 'ADMIN_BROADCAST', label: 'Admin Broadcast' },
    { value: 'BID_PLACED', label: 'Bid Placed' },
    { value: 'BID_ACCEPTED', label: 'Bid Accepted' },
    { value: 'BID_REJECTED', label: 'Bid Rejected' },
    { value: 'ORDER_CREATED', label: 'Order Created' },
    { value: 'ORDER_STATUS_CHANGE', label: 'Order Status Change' },
    { value: 'PAYMENT_RECEIVED', label: 'Payment Received' },
    { value: 'PAYMENT_REMINDER', label: 'Payment Reminder' },
    { value: 'FERTILIZER_ALLOCATED', label: 'Fertilizer Allocated' },
    { value: 'FERTILIZER_READY', label: 'Fertilizer Ready' },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchUsers(),
          fetchNotificationStats()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch initial data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
      throw error;
    }
  };

  const fetchNotificationStats = async () => {
    try {
      const response = await axios.get('/api/notifications/stats');
      setStats(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      setStats({
        total: 0,
        read: 0,
        unread: 0,
        broadcasts: 0
      });
      throw error;
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchNotificationHistory();
    }
  }, [activeTab]);

  const sortNotifications = (notifications, sortBy, sortOrder) => {
    try {
      return notifications.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } catch (error) {
      console.error("Sorting went wrong:", error);
      return notifications;
    }
  };

  const fetchNotificationHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/notifications/broadcasts');
      const sortedNotifications = sortNotifications(response.data, 'createdDate', 'asc');
      setNotifications(sortedNotifications);
      setStats(prev => ({
        ...prev,
        total: sortedNotifications.length,
        broadcasts: sortedNotifications.filter(n => !n.recipientNic).length
      }));
    } catch (error) {
      console.error("Error fetching notification history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notification history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchNotificationHistory(),
        fetchNotificationStats()
      ]);
      toast({
        title: "Success",
        description: "Data refreshed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBroadcast = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description
      };
      await axios.post('/api/notifications/broadcast', payload);
      
      toast({
        title: "Success",
        description: "Broadcast message sent successfully"
      });
      
      setFormData(prev => ({
        ...prev,
        title: '',
        description: ''
      }));

      fetchNotificationStats();
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send broadcast message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDirectNotification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.notificationType,
        priority: formData.priority
      };

      if (formData.recipientType === 'specific') {
        if (!formData.recipientNic) {
          throw new Error("Please select a recipient");
        }
        payload.recipientNic = formData.recipientNic;
      }

      const endpoint = formData.recipientType === 'specific' 
        ? '/api/notifications' 
        : '/api/notifications/broadcast';
      
      await axios.post(endpoint, payload);
      
      toast({
        title: "Success",
        description: `Notification ${formData.recipientType === 'specific' ? 'sent' : 'broadcast'} successfully`
      });
      
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        recipientNic: ''
      }));

      fetchNotificationStats();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message || "Failed to send notification",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/notifications/${id}`);
      
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
      
      await Promise.all([
        fetchNotificationHistory(),
        fetchNotificationStats()
      ]);
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all notifications? This action cannot be undone.")) return;

    try {
      setIsLoading(true);
      await axios.delete('/api/notifications');
      
      toast({
        title: "Success",
        description: "All notifications deleted successfully"
      });
      
      await Promise.all([
        fetchNotificationHistory(),
        fetchNotificationStats()
      ]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast({
        title: "Error",
        description: "Failed to delete all notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Notification Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-medium mb-2">Total</p>
            <p className="text-4xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-medium mb-2">Read</p>
            <p className="text-4xl font-bold">{stats.read}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-medium mb-2">Unread</p>
            <p className="text-4xl font-bold">{stats.unread}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-medium mb-2">Broadcasts</p>
            <p className="text-4xl font-bold">{stats.broadcasts}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="broadcast">Quick Broadcast</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast">
          <Card>
            <CardHeader>
              <CardTitle>Send Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBroadcast} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Broadcast title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Message</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your broadcast message"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Broadcast
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDirectNotification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adv-title">Title</Label>
                  <Input
                    id="adv-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Notification title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adv-description">Message</Label>
                  <Textarea
                    id="adv-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter notification message"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Recipient Type</Label>
                  <RadioGroup 
                    value={formData.recipientType} 
                    onValueChange={(value) => handleSelectChange('recipientType', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="broadcast" id="broadcast" />
                      <Label htmlFor="broadcast">Broadcast (All Users)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="specific" />
                      <Label htmlFor="specific">Specific User</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.recipientType === 'specific' && (
                  <div className="space-y-2">
                    <Label htmlFor="recipientNic">Select Recipient</Label>
                    <Select
                      value={formData.recipientNic}
                      onValueChange={(value) => handleSelectChange('recipientNic', value)}
                    >
                      <SelectTrigger id="recipientNic">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.nic} value={user.nic}>
                            {user.fullName} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notificationType">Notification Type</Label>
                  <Select
                    value={formData.notificationType}
                    onValueChange={(value) => handleSelectChange('notificationType', value)}
                  >
                    <SelectTrigger id="notificationType">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Notifications</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Created At</th>
                        <th className="text-left py-3 px-4">Recipient</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map(notification => (
                        <tr key={notification.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{notification.title}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {notification.type?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">{formatDate(notification.createdDate)}</td>
                          <td className="py-3 px-4">
                            {notification.recipientNic || 'Broadcast'}
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBroadcast;