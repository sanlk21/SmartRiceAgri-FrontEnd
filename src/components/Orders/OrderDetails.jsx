import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const OrderDetails = ({ order, showPaymentForm = false }) => {
  const { user } = useAuth();

  const getStatusBadgeColor = (status) => {
    const colors = {
      'PENDING_PAYMENT': 'bg-yellow-50 text-yellow-700',
      'PAYMENT_COMPLETED': 'bg-green-50 text-green-700',
      'CANCELLED': 'bg-red-50 text-red-700'
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="secondary">
          {order.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Details Card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium">{order.quantity}kg</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Price per kg</span>
                <span className="font-medium">Rs. {order.pricePerKg}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold text-lg">Rs. {order.totalAmount}</span>
              </div>
              {order.paymentDeadline && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Payment Deadline</span>
                  <span className="font-medium text-yellow-700">
                    {format(new Date(order.paymentDeadline), 'PPp')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details Card */}
        {user?.role === 'BUYER' && order.status === 'PENDING_PAYMENT' && !showPaymentForm && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Bank Name</span>
                  <span className="font-medium">{order.farmerBankName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Branch</span>
                  <span className="font-medium">{order.farmerBankBranch}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium">{order.farmerAccountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Account Holder</span>
                  <span className="font-medium">{order.farmerAccountHolderName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;