import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/paymentService';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const PaymentStatus = ({ showNavigation = false }) => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingProof, setDownloadingProof] = useState(false);

  const fetchPayment = useCallback(async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayment(paymentId);
      setPayment(data);
      setError(null);

      // Redirect if payment is completed
      if (data.status === 'COMPLETED') {
        setTimeout(() => {
          navigate('/payments/buyer', { replace: true });
        }, 3000); // Show success state for 3 seconds before redirecting
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { 
          replace: true,
          state: { from: location.pathname }
        });
      } else {
        setError(err.message || 'Failed to fetch payment details');
      }
    } finally {
      setLoading(false);
    }
  }, [paymentId, navigate, location.pathname]);

  useEffect(() => {
    fetchPayment();

    // Poll for updates if payment is in a non-final state
    const nonFinalStates = ['PENDING', 'PROCESSING'];
    let interval;
    
    if (payment && nonFinalStates.includes(payment.status)) {
      interval = setInterval(fetchPayment, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchPayment, payment?.status]);

  // ... rest of the component code remains the same ...

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* ... existing JSX ... */}
      
      {/* Add Retry Payment button for failed payments */}
      {payment?.status === 'FAILED' && user?.role === 'BUYER' && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => navigate(`/payments/buyer/payments/${paymentId}/process`)}
            variant="default"
          >
            Retry Payment
          </Button>
        </div>
      )}
      
      {/* ... rest of the JSX ... */}
    </Card>
  );
};

export default PaymentStatus;