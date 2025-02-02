import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePayment } from '@/context/PaymentContext';
import { paymentService } from '@/services/paymentService';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentForm from '../PaymentForm';

const PaymentOptions = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { processPayment } = usePayment();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPayment(paymentId);
        
        // Redirect if payment is already processed
        if (data.status !== 'PENDING_PAYMENT') {
          navigate(`/payments/buyer/payments/${paymentId}/status`, { replace: true });
          return;
        }
        
        setPayment(data);
      } catch (err) {
        setError(err.message || 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId, navigate]);

  const handleClose = () => {
    navigate('/payments/buyer', { replace: true });
  };

  const handleSuccess = async (paymentDetails) => {
    try {
      const updatedPayment = await processPayment(paymentId, paymentDetails);
      navigate(`/payments/buyer/payments/${paymentId}/status`, { 
        replace: true,
        state: { payment: updatedPayment }
      });
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Process Payment</h1>
      <PaymentForm
        payment={payment}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PaymentOptions;