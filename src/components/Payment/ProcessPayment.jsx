import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentProcessing = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processPayment, fetchPaymentDetails } = usePayment();
  const [status, setStatus] = useState('PROCESSING');
  const [loading, setLoading] = useState(true);

  const checkPaymentStatus = useCallback(async () => {
    try {
      const payment = await fetchPaymentDetails(paymentId);
      setStatus(payment.status);

      if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(payment.status)) {
        // Payment reached a final state
        setTimeout(() => {
          navigate(`/payments/${user.role.toLowerCase()}`);
        }, 3000);
        return true;
      }
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking payment status",
        description: error.message
      });
      return true; // Stop polling on error
    }
  }, [paymentId, navigate, user.role, fetchPaymentDetails]);

  useEffect(() => {
    let interval;

    const pollPaymentStatus = async () => {
      const shouldStop = await checkPaymentStatus();
      if (shouldStop) {
        clearInterval(interval);
        setLoading(false);
      }
    };

    // Start polling
    pollPaymentStatus();
    interval = setInterval(pollPaymentStatus, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkPaymentStatus]);

  const getStatusContent = () => {
    switch (status) {
      case 'PROCESSING':
        return {
          title: 'Processing Payment',
          description: 'Please wait while we process your payment...',
          icon: <Loader2 className="h-12 w-12 animate-spin text-primary" />,
          className: 'text-primary'
        };
      case 'COMPLETED':
        return {
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          className: 'text-green-500'
        };
      case 'FAILED':
        return {
          title: 'Payment Failed',
          description: 'We could not process your payment. Please try again.',
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          className: 'text-red-500'
        };
      case 'CANCELLED':
        return {
          title: 'Payment Cancelled',
          description: 'This payment has been cancelled.',
          icon: <AlertCircle className="h-12 w-12 text-yellow-500" />,
          className: 'text-yellow-500'
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'An error occurred while processing your payment.',
          icon: <AlertCircle className="h-12 w-12 text-gray-500" />,
          className: 'text-gray-500'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className={statusContent.className}>
          {statusContent.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {statusContent.icon}
          <p className="text-gray-600 text-center">
            {statusContent.description}
          </p>

          {(['FAILED', 'CANCELLED'].includes(status) && !loading) && (
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/payments/${user.role.toLowerCase()}`)}
              >
                Back to Payments
              </Button>
              <Button
                onClick={() => navigate(`/payments/${user.role.toLowerCase()}/${paymentId}/process`)}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessing;