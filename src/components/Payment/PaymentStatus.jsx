import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { paymentService } from '@/services/paymentService';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const PaymentStatus = ({ paymentId }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await paymentService.getPaymentDetails(paymentId);
        setPayment(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'REFUNDED':
        return <AlertCircle className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const renderPaymentDetails = () => {
    switch (payment.paymentMethod) {
      case 'BANK_TRANSFER':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-medium">{payment.details.senderBankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-medium">{payment.details.senderAccountNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Name</p>
              <p className="font-medium">{payment.details.senderAccountName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transfer Date</p>
              <p className="font-medium">
                {format(new Date(payment.details.transferDate), 'PPp')}
              </p>
            </div>
            {payment.paymentProofDocumentPath && (
              <Button 
                variant="outline" 
                size="sm"
                className="col-span-2"
                onClick={() => window.open(`/api/payments/${paymentId}/proof`, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                View Payment Proof
              </Button>
            )}
          </div>
        );

      case 'CASH_ON_DELIVERY':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">{payment.details.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scheduled Date</p>
              <p className="font-medium">
                {format(new Date(payment.details.scheduledDeliveryDate), 'PPp')}
              </p>
            </div>
            {payment.details.deliveryAgentName && (
              <div>
                <p className="text-sm text-gray-500">Delivery Agent</p>
                <p className="font-medium">{payment.details.deliveryAgentName}</p>
              </div>
            )}
            {payment.details.deliveryContactNumber && (
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{payment.details.deliveryContactNumber}</p>
              </div>
            )}
          </div>
        );

      case 'ONLINE_PAYMENT':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Gateway</p>
              <p className="font-medium">{payment.details.paymentGatewayName}</p>
            </div>
            {payment.details.paymentGatewayTransactionId && (
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium">{payment.details.paymentGatewayTransactionId}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!payment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Payment not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Payment #{payment.paymentNumber}</CardTitle>
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(payment.status)}`}>
            {getStatusIcon(payment.status)}
            {payment.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-2xl font-bold">Rs. {payment.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{payment.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{format(new Date(payment.createdAt), 'PPp')}</p>
            </div>
            {payment.completedAt && (
              <div>
                <p className="text-sm text-gray-500">Completed At</p>
                <p className="font-medium">{format(new Date(payment.completedAt), 'PPp')}</p>
              </div>
            )}
          </div>

          {renderPaymentDetails()}

          {payment.status === 'FAILED' && payment.failureReason && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{payment.failureReason}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

PaymentStatus.propTypes = {
  paymentId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default PaymentStatus;