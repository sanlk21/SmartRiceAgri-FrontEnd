// src/components/orders/OrderDetails.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentForm from './PaymentForm';

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
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

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Order Details</h3>
              <p>Quantity: {order.quantity}kg</p>
              <p>Price per kg: Rs.{order.pricePerKg}</p>
              <p>Total Amount: Rs.{order.totalAmount}</p>
            </div>
            
            {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
              <div>
                <h3 className="font-semibold">Bank Details</h3>
                <p>Bank: {order.farmerBankName}</p>
                <p>Branch: {order.farmerBankBranch}</p>
                <p>Account #: {order.farmerAccountNumber}</p>
                <p>Account Holder: {order.farmerAccountHolderName}</p>
              </div>
            )}
          </div>

          {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
            <PaymentForm order={order} onSuccess={fetchOrderDetails} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}