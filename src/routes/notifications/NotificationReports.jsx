import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart2, Bell, LineChart as LineChartIcon, Loader2, PieChart as PieChartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data for the charts - in a real app, this would come from the API
const sampleData = {
  typeDistribution: [
    { name: 'Broadcasts', value: 12 },
    { name: 'Bid Notifications', value: 25 },
    { name: 'Order Notifications', value: 18 },
    { name: 'Payment Notifications', value: 15 },
    { name: 'Fertilizer Notifications', value: 10 }
  ],
  readUnreadDistribution: [
    { name: 'Read', value: 45 },
    { name: 'Unread', value: 35 }
  ],
  userNotifications: [
    { name: 'Farmer 1', notifications: 8 },
    { name: 'Farmer 2', notifications: 12 },
    { name: 'Buyer 1', notifications: 15 },
    { name: 'Buyer 2', notifications: 9 },
    { name: 'Admin', notifications: 20 }
  ],
  weeklyActivity: [
    { name: 'Monday', sent: 15, read: 10 },
    { name: 'Tuesday', sent: 20, read: 15 },
    { name: 'Wednesday', sent: 25, read: 18 },
    { name: 'Thursday', sent: 18, read: 14 },
    { name: 'Friday', sent: 22, read: 17 },
    { name: 'Saturday', sent: 12, read: 8 },
    { name: 'Sunday', sent: 10, read: 5 }
  ],
  monthlyTrends: [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 65 },
    { name: 'Apr', value: 58 },
    { name: 'May', value: 72 },
    { name: 'Jun', value: 80 }
  ]
};

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const NotificationReports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30days");
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState(sampleData);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch data from an API based on the selected date range
    // For now, we'll simulate loading
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch actual data here
        // For now, we'll just use our sample data
        setReports(sampleData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch report data"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [dateRange, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Notification Reports</h1>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Analyze notification trends and statistics
        </p>
        
        <Select
          value={dateRange}
          onValueChange={setDateRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            User Analysis
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Distribution of notifications by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reports.typeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {reports.typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} notifications`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Read vs Unread</CardTitle>
                <CardDescription>
                  Proportion of read and unread notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reports.readUnreadDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#f87171" />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} notifications`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>
                  Notifications sent and read by day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reports.weeklyActivity}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sent" name="Notifications Sent" fill="#8884d8" />
                      <Bar dataKey="read" name="Notifications Read" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* User Analysis Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users with Most Notifications</CardTitle>
              <CardDescription>
                Top users receiving notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reports.userNotifications}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="notifications" name="Notifications" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Notification Trends</CardTitle>
              <CardDescription>
                Notification volume over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reports.monthlyTrends}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Notifications" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationReports;