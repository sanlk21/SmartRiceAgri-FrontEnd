// src/components/admin/orders/AdminOrderDetail.jsx
import { orderApi } from '@/api/orderApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await orderApi.getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.orderNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Order Information</h3>
              <div className="space-y-2">
                <p>Status: {order.status}</p>
                <p>Created: {new Date(order.orderDate).toLocaleString()}</p>
                <p>Payment Deadline: {new Date(order.paymentDeadline).toLocaleString()}</p>
                {order.paymentDate && (
                  <p>Payment Date: {new Date(order.paymentDate).toLocaleString()}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="space-y-2">
                <p>Method: {order.paymentMethod || 'Not set'}</p>
                <p>Reference: {order.paymentReference || 'Not set'}</p>
                <p>Amount: Rs. {order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Farmer Details</h3>
              <div className="space-y-2">
                <p>NIC: {order.farmerNic}</p>
                <p>Bank: {order.farmerBankName}</p>
                <p>Branch: {order.farmerBankBranch}</p>
                <p>Account: {order.farmerAccountNumber}</p>
                <p>Account Holder: {order.farmerAccountHolderName}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Buyer Details</h3>
              <div className="space-y-2">
                <p>NIC: {order.buyerNic}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select 
              value={order.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="PAYMENT_COMPLETED">Payment Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back to Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}