import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const PaymentStatus = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayment = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      const response = await fetch(`/api/payments/${paymentId}`);
      if (!response.ok) throw new Error('Failed to fetch payment details');
      const data = await response.json();
      setPayment(data);
      setError(null);

      // Auto-redirect on completion
      if (data.status === 'COMPLETED') {
        setTimeout(() => {
          navigate(`/${user.role.toLowerCase()}/payments`, { replace: true });
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
      if (err.response?.status === 401) {
        navigate('/login', { 
          replace: true,
          state: { from: location.pathname }
        });
      }
    } finally {
      setLoading(false);
    }
  }, [paymentId, navigate, location.pathname, user.role]);

  useEffect(() => {
    fetchPayment();

    // Poll for updates if payment is pending or processing
    const nonFinalStates = ['PENDING', 'PROCESSING'];
    let interval;
    
    if (payment && nonFinalStates.includes(payment.status)) {
      interval = setInterval(fetchPayment, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchPayment, payment?.status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'PROCESSING': return 'text-blue-600 bg-blue-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="font-medium">#{payment?.orderId}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Amount</div>
              <div className="font-medium">Rs. {payment?.amount?.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Payment Method</div>
              <div className="font-medium">{payment?.paymentMethod?.replace(/_/g, ' ')}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Status</div>
              <div className={`inline-flex px-2 py-1 rounded text-sm font-medium ${getStatusColor(payment?.status)}`}>
                {payment?.status}
              </div>
            </div>
          </div>

          {/* Payment Details Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payment?.paymentMethod === 'BANK_TRANSFER' && (
                <>
                  <TableRow>
                    <TableCell className="font-medium">Bank Name</TableCell>
                    <TableCell>{payment.senderBankName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Account Number</TableCell>
                    <TableCell>{payment.senderAccountNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Transfer Date</TableCell>
                    <TableCell>{new Date(payment.transferDate).toLocaleString()}</TableCell>
                  </TableRow>
                </>
              )}
              {payment?.paymentMethod === 'CASH_ON_DELIVERY' && (
                <>
                  <TableRow>
                    <TableCell className="font-medium">Delivery Address</TableCell>
                    <TableCell>{payment.deliveryAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Scheduled Date</TableCell>
                    <TableCell>{new Date(payment.scheduledDeliveryDate).toLocaleString()}</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/${user.role.toLowerCase()}/payments`)}
            >
              Back to Payments
            </Button>
            {payment?.status === 'FAILED' && user?.role === 'BUYER' && (
              <Button 
                onClick={() => navigate(`/buyer/payments/${paymentId}/process`)}
              >
                Retry Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;