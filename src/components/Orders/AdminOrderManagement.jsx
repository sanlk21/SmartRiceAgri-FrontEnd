import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, DollarSign, Loader2, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';

const AdminOrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user?.role === 'ADMIN') {
          const allOrders = await orderApi.getAllOrders();
          setOrders(allOrders);
        }
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500 font-medium">Access Denied</div>
      </div>
    );
  }

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingPayments = orders.filter(order => order.status === 'PENDING_PAYMENT').length;
    const completedOrders = orders.filter(order => order.status === 'PAYMENT_COMPLETED').length;
    const totalRevenue = orders
      .filter(order => order.status === 'PAYMENT_COMPLETED')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return { totalOrders, pendingPayments, completedOrders, totalRevenue };
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || (
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toString().includes(searchTerm) ||
      (order.buyerNic && order.buyerNic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.farmerNic && order.farmerNic.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'PENDING_PAYMENT': 'bg-yellow-100 text-yellow-800',
      'PAYMENT_COMPLETED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={`${statusStyles[status] || 'bg-gray-100 text-gray-800'} px-2 py-1`}>
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const stats = getOrderStats();

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by Order Number, ID or NIC..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select 
                    value={filterStatus} 
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                      <SelectItem value="PAYMENT_COMPLETED">Completed</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Buyer NIC</TableHead>
                        <TableHead>Farmer NIC</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.orderNumber || `ORD-${order.id.toString().padStart(3, '0')}`}
                            </TableCell>
                            <TableCell>{order.buyerNic || '-'}</TableCell>
                            <TableCell>{order.farmerNic || '-'}</TableCell>
                            <TableCell>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              Rs. {order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(order)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={7} 
                            className="text-center py-6 text-gray-500"
                          >
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
              <DialogDescription className="text-base">
                Order Number: <span className="font-medium">{selectedOrder.orderNumber || `ORD-${selectedOrder.id.toString().padStart(3, '0')}`}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-3 text-base">Buyer Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NIC:</span>
                    <span className="font-medium">{selectedOrder.buyerNic || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-3 text-base">Farmer Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">NIC:</span>
                    <span className="font-medium">{selectedOrder.farmerNic || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-3 text-base">Order Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Order Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedOrder.paymentDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Date:</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.paymentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="font-medium">{selectedOrder.quantity}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price per kg:</span>
                      <span className="font-medium">Rs. {selectedOrder.pricePerKg?.toFixed(2) || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="font-medium">Rs. {selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.status === 'PENDING_PAYMENT' && (
                <div className="col-span-2 p-4 border rounded-lg bg-white shadow-sm">
                  <h3 className="font-semibold mb-3 text-base">Payment Information</h3>
                  <div className="space-y-3">
                    {selectedOrder.farmerBankName && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Bank Name:</span>
                          <span className="font-medium">{selectedOrder.farmerBankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Branch:</span>
                          <span className="font-medium">{selectedOrder.farmerBankBranch}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Number:</span>
                          <span className="font-medium">{selectedOrder.farmerAccountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Holder:</span>
                          <span className="font-medium">{selectedOrder.farmerAccountHolderName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminOrderManagement;