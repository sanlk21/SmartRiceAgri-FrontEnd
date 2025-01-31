import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/context/OrderContext';
import { usePayment } from '@/context/PaymentContext';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PendingPayments = () => {
  const navigate = useNavigate();
  const { state: { orders }, fetchOrders } = useOrders();
  const { initializePayment } = usePayment();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const pendingOrders = orders.filter(order => order.status === 'PENDING_PAYMENT') || [];

  const handlePayment = async (order) => {
    setLoading(true);
    try {
      const payment = await initializePayment(order.id);
      navigate(`/buyer/payments/${payment.id}/process`);
    } catch (error) {
      console.error('Error initializing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (pendingOrders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">No pending payments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pendingOrders.map((order) => (
        <Card key={order.id} className="bg-white">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{order.orderNumber}</span>
              <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Payment Due
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Amount Due</p>
                  <p className="text-2xl font-bold">Rs. {order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {format(new Date(order.paymentDeadline), 'PPP')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-medium">{order.quantity}kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Price per kg</p>
                  <p className="font-medium">Rs. {order.pricePerKg}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => handlePayment(order)}
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingPayments;