// src/components/Orders/OrderList.jsx
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

export default function OrderList({ status }) {
  const { state, fetchOrders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders(user.nic, user.role);
    }
  }, [user]);

  // Add null/empty check
  if (!state.orders || state.orders.length === 0) {
    return <div className="text-center py-4">No orders found</div>;
  }

  // Filter orders by status if provided
  const filteredOrders = status ? 
    state.orders.filter(order => order.status === status) : 
    state.orders;

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            Quantity: {order.quantity}kg
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">Rs. {order.totalAmount}</p>
          <span className={`text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
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