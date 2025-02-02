import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { usePayment } from '@/context/PaymentContext';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BankTransfer from './PaymentMethods/BankTransfer';
import CashOnDelivery from './PaymentMethods/CashOnDelivery';
import OnlinePayment from './PaymentMethods/OnlinePayment';

const ProcessPayment = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { fetchPaymentDetails, processPayment } = usePayment();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        const data = await fetchPaymentDetails(paymentId);
        
        // Redirect if payment is not pending
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

    loadPayment();
  }, [paymentId, navigate, fetchPaymentDetails]);

  const handlePayment = async (method, details) => {
    try {
      setProcessing(true);
      const result = await processPayment(paymentId, {
        method,
        ...details
      });

      toast({
        title: "Payment Initiated",
        description: "Your payment is being processed"
      });

      navigate(`/payments/buyer/payments/${paymentId}/status`, {
        replace: true,
        state: { payment: result }
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: err.message || "Failed to process payment"
      });
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  // ... rest of the component remains the same ...

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
        disabled={processing}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ... existing content ... */}
          
          <Tabs defaultValue="bank_transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank_transfer" disabled={processing}>
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger value="cash_delivery" disabled={processing}>
                Cash on Delivery
              </TabsTrigger>
              <TabsTrigger value="online" disabled={processing}>
                Online Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bank_transfer">
              <BankTransfer 
                payment={payment} 
                onSubmit={(details) => handlePayment('BANK_TRANSFER', details)}
                disabled={processing}
              />
            </TabsContent>
            <TabsContent value="cash_delivery">
              <CashOnDelivery 
                payment={payment}
                onSubmit={(details) => handlePayment('CASH_ON_DELIVERY', details)}
                disabled={processing}
              />
            </TabsContent>
            <TabsContent value="online">
              <OnlinePayment 
                payment={payment}
                onSubmit={(details) => handlePayment('ONLINE_PAYMENT', details)}
                disabled={processing}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessPayment;