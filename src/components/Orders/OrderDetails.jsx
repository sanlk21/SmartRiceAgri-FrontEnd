import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import PaymentForm from './PaymentForm';

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Order not found</div>
      </div>
    );
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      'PENDING_PAYMENT': 'bg-yellow-50 text-yellow-700',
      'PAYMENT_COMPLETED': 'bg-green-50 text-green-700',
      'CANCELLED': 'bg-red-50 text-red-700'
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Order Summary Card */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Order #{order.orderNumber}</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{order.quantity}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per kg</span>
                  <span className="font-medium">Rs. {order.pricePerKg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">Rs. {order.totalAmount}</span>
                </div>
                {order.paymentDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Deadline</span>
                    <span className="font-medium">
                      {format(new Date(order.paymentDeadline), 'PPp')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details (for pending payments) */}
            {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bank Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name</span>
                    <span className="font-medium">{order.farmerBankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch</span>
                    <span className="font-medium">{order.farmerBankBranch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-medium">{order.farmerAccountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Holder</span>
                    <span className="font-medium">{order.farmerAccountHolderName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pay Now Button */}
          {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && !showPaymentForm && (
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowPaymentForm(true)}>
                Pay Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      {showPaymentForm && (
        <Card>
          <CardContent className="pt-6">
            <PaymentForm
              order={order}
              onClose={() => setShowPaymentForm(false)}
              onSuccess={() => {
                setShowPaymentForm(false);
                fetchOrderDetails();
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}