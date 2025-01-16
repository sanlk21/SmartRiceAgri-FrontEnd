import { paymentApi } from '@/api/paymentApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { AlertCircle, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        let data;
        if (user.role === 'BUYER') {
          data = await paymentApi.getBuyerPayments(user.nic);
        } else if (user.role === 'FARMER') {
          data = await paymentApi.getFarmerPayments(user.nic);
        }
        setPayments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const filteredPayments = payments.filter(payment => {
    if (filters.status && payment.status !== filters.status) {
      return false;
    }
    if (filters.paymentMethod && payment.paymentMethod !== filters.paymentMethod) {
      return false;
    }
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        payment.paymentNumber.toLowerCase().includes(searchTerm) ||
        payment.status.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPaymentProof = async (paymentId) => {
    try {
      const blob = await paymentApi.getPaymentProof(paymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-proof-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading proof:', err);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>

            <Select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            >
              <option value="">All Payment Methods</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="ONLINE_PAYMENT">Online Payment</option>
            </Select>

            <Input
              placeholder="Search payments..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{payment.paymentNumber}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Amount: Rs. {payment.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Method: {payment.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {format(new Date(payment.createdAt), 'PPp')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {payment.paymentProofDocumentPath && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPaymentProof(payment.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Proof
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/payments/${payment.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                {payment.status === 'FAILED' && payment.failureReason && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{payment.failureReason}</AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
            {filteredPayments.length === 0 && (
              <p className="text-center text-gray-500 py-4">No payments found</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;