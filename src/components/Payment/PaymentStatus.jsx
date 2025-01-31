import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { paymentService } from '@/services/paymentService';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Download, RefreshCcw, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = ({ paymentId, showNavigation = false }) => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingProof, setDownloadingProof] = useState(false);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayment(paymentId);
      setPayment(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();

    // Poll for updates if payment is in a non-final state
    const nonFinalStates = ['PENDING', 'PROCESSING'];
    let interval;
    
    if (payment && nonFinalStates.includes(payment.status)) {
      interval = setInterval(fetchPayment, 30000); // Poll every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentId, payment?.status]);

  const handleDownloadProof = async () => {
    try {
      setDownloadingProof(true);
      const blob = await paymentService.downloadPaymentProof(paymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-proof-${payment.paymentNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download payment proof');
    } finally {
      setDownloadingProof(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: <Clock className="h-12 w-12 text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800',
        title: 'Payment Pending',
        description: 'Your payment is awaiting processing.'
      },
      PROCESSING: {
        icon: <RefreshCcw className="h-12 w-12 text-blue-600 animate-spin" />,
        color: 'bg-blue-100 text-blue-800',
        title: 'Processing Payment',
        description: 'Your payment is being processed.'
      },
      COMPLETED: {
        icon: <CheckCircle className="h-12 w-12 text-green-600" />,
        color: 'bg-green-100 text-green-800',
        title: 'Payment Completed',
        description: 'Payment has been successfully processed.'
      },
      FAILED: {
        icon: <XCircle className="h-12 w-12 text-red-600" />,
        color: 'bg-red-100 text-red-800',
        title: 'Payment Failed',
        description: 'There was an issue processing your payment.'
      },
      CANCELLED: {
        icon: <XCircle className="h-12 w-12 text-gray-600" />,
        color: 'bg-gray-100 text-gray-800',
        title: 'Payment Cancelled',
        description: 'This payment has been cancelled.'
      },
      REFUNDED: {
        icon: <RefreshCcw className="h-12 w-12 text-purple-600" />,
        color: 'bg-purple-100 text-purple-800',
        title: 'Payment Refunded',
        description: 'This payment has been refunded.'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const renderPaymentMethodDetails = () => {
    if (!payment?.details) return null;

    const detailsMap = {
      BANK_TRANSFER: [
        { label: 'Bank Name', value: payment.details.senderBankName },
        { label: 'Account Number', value: payment.details.senderAccountNumber },
        { label: 'Account Name', value: payment.details.senderAccountName },
        { label: 'Transfer Date', value: format(new Date(payment.details.transferDate), 'PPp') }
      ],
      CASH_ON_DELIVERY: [
        { label: 'Delivery Address', value: payment.details.deliveryAddress },
        { label: 'Scheduled Date', value: format(new Date(payment.details.scheduledDeliveryDate), 'PPp') },
        { label: 'Delivery Agent', value: payment.details.deliveryAgentName },
        { label: 'Contact Number', value: payment.details.deliveryContactNumber }
      ],
      ONLINE_PAYMENT: [
        { label: 'Gateway', value: payment.details.paymentGatewayName },
        { label: 'Transaction ID', value: payment.details.paymentGatewayTransactionId }
      ]
    };

    const details = detailsMap[payment.paymentMethod];
    if (!details) return null;

    return (
      <div className="mt-6 space-y-6">
        <h3 className="font-semibold text-lg">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {details.map(({ label, value }) => value && (
            <div key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>

        {payment.paymentMethod === 'BANK_TRANSFER' && payment.paymentProofDocumentPath && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleDownloadProof}
            disabled={downloadingProof}
          >
            <Download className="h-4 w-4 mr-2" />
            {downloadingProof ? 'Downloading...' : 'Download Payment Proof'}
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
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

  const statusConfig = getStatusConfig(payment.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span>Payment #{payment.paymentNumber}</span>
          </CardTitle>
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${statusConfig.color}`}>
            {statusConfig.icon}
            <span>{payment.status}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="flex flex-col items-center py-6">
            {statusConfig.icon}
            <h2 className="text-xl font-semibold mt-4">{statusConfig.title}</h2>
            <p className="text-gray-500 mt-2">{statusConfig.description}</p>
          </div>

          {/* Basic Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-2xl font-bold">Rs. {payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{payment.paymentMethod.replace('_', ' ')}</p>
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

          {renderPaymentMethodDetails()}

          {payment.failureReason && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{payment.failureReason}</AlertDescription>
            </Alert>
          )}

          {showNavigation && (
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => navigate('/payments/buyer')}
                variant="outline"
              >
                Back to Payments
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

PaymentStatus.propTypes = {
  paymentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  showNavigation: PropTypes.bool
};

export default PaymentStatus;