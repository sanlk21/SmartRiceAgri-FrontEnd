import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayment } from '@/context/PaymentContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BankTransfer from './PaymentMethods/BankTransfer';
import CashOnDelivery from './PaymentMethods/CashOnDelivery';
import OnlinePayment from './PaymentMethods/OnlinePayment';

const ProcessPayment = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { fetchPaymentDetails } = usePayment();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        const data = await fetchPaymentDetails(paymentId);
        setPayment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>
            Choose your preferred payment method to complete the transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Order Summary</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">#{payment.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">Rs. {payment.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="bank_transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
              <TabsTrigger value="cash_delivery">Cash on Delivery</TabsTrigger>
              <TabsTrigger value="online">Online Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="bank_transfer">
              <BankTransfer payment={payment} />
            </TabsContent>
            <TabsContent value="cash_delivery">
              <CashOnDelivery payment={payment} />
            </TabsContent>
            <TabsContent value="online">
              <OnlinePayment payment={payment} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessPayment;