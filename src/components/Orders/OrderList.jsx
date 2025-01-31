import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import PaymentForm from './PaymentForm';

export default function OrderList({ status }) {
  const { state, fetchOrders } = useOrders();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders(user.nic, user.role);
    }
  }, [user]);

  if (!state.orders || state.orders.length === 0) {
    return <div className="text-center py-4">No orders found</div>;
  }

  // Filter orders by status if provided
  const filteredOrders = status 
    ? state.orders.filter(order => order.status === status) 
    : state.orders;

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          user={user} 
          onPayNow={() => {
            setSelectedOrder(order);
            setShowPaymentForm(true);
          }} 
        />
      ))}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedOrder && (
        <PaymentForm 
          order={selectedOrder} 
          onClose={() => setShowPaymentForm(false)} 
          onSuccess={() => window.location.reload()} 
        />
      )}
    </div>
  );
}

function OrderCard({ order, user, onPayNow }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">Quantity: {order.quantity}kg</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Rs. {order.totalAmount}</p>
          <span className={`text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Show "Pay Now" button only for BUYER with PENDING_PAYMENT orders */}
      {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
        <div className="mt-3 text-right">
          <Button onClick={onPayNow}>Pay Now</Button>
        </div>
      )}
    </Card>
  );
}

function getStatusColor(status) {
  const colors = {
    'PENDING_PAYMENT': 'text-yellow-600',
    'PAYMENT_COMPLETED': 'text-green-600',
    'CANCELLED': 'text-red-600'
  };
  return colors[status] || 'text-gray-600';
}
