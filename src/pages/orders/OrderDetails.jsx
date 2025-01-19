import PaymentForm from '@/components/Orders/PaymentForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { currentOrder, loading, error, getOrderDetails } = useOrders();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId, getOrderDetails]);

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

  if (!currentOrder) {
    return (
      <Alert>
        <AlertDescription>Order not found</AlertDescription>
      </Alert>
    );
  }

  const formatDate = (date) => format(new Date(date), 'PPpp');

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = async () => {
    // Implement receipt download functionality
    console.log('Downloading receipt...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order #{currentOrder.orderNumber}</CardTitle>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentOrder.status)}`}>
            {currentOrder.status}
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(currentOrder.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">Rs. {currentOrder.totalAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium">{currentOrder.quantity}kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price per kg</p>
              <p className="font-medium">Rs. {currentOrder.pricePerKg}</p>
            </div>
          </div>

          {/* Bank Details for Pending Payment */}
          {currentOrder.status === 'PENDING_PAYMENT' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bank Details for Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="font-medium">{currentOrder.farmerBankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{currentOrder.farmerBankBranch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium">{currentOrder.farmerAccountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Holder</p>
                  <p className="font-medium">{currentOrder.farmerAccountHolderName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {currentOrder.status === 'PAYMENT_COMPLETED' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{currentOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium">{formatDate(currentOrder.paymentDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium">{currentOrder.paymentReference}</p>
                </div>
              </div>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={handleDownloadReceipt}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          )}

          {/* Payment Action */}
          {currentOrder.status === 'PENDING_PAYMENT' && user?.role === 'BUYER' && (
            <div className="flex justify-end">
              <Button onClick={() => setShowPaymentForm(true)}>
                Make Payment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showPaymentForm && (
        <PaymentForm
          order={currentOrder}
          onClose={() => setShowPaymentForm(false)}
          onSuccess={() => {
            setShowPaymentForm(false);
            getOrderDetails(orderId);
          }}
        />
      )}
    </div>
  );
};

export default OrderDetails;