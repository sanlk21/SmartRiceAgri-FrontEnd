import { paymentService } from '@/services/paymentService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentForm from '../PaymentForm';

const PaymentOptions = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await paymentService.getPayment(paymentId);
        setOrder(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [paymentId]);

  const handleClose = () => {
    navigate('/payments/buyer');
  };

  const handleSuccess = () => {
    navigate(`/payments/buyer/payments/${paymentId}/status`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>No payment details found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Process Payment</h1>
      <PaymentForm
        order={order}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PaymentOptions;