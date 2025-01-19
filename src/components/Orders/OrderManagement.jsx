import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useEffect, useState } from 'react';
import OrderList from './OrderList';
import PaymentForm from './PaymentForm';

const OrderManagement = () => {
  const { user } = useAuth();
  const { orders, loading, error, fetchOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders(user.role, user.nic);
    }
  }, [user, fetchOrders]);

  const handlePaymentClick = (order) => {
    setSelectedOrder(order);
    setShowPaymentForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderList 
            orders={orders}
            onPaymentClick={handlePaymentClick}
            userRole={user?.role}
          />
        </CardContent>
      </Card>

      {showPaymentForm && selectedOrder && (
        <PaymentForm
          order={selectedOrder}
          onClose={() => setShowPaymentForm(false)}
          onSuccess={() => {
            setShowPaymentForm(false);
            fetchOrders(user.role, user.nic);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;