import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { format } from 'date-fns';
import { ArrowRight, CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerPaymentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { payments, loading, error, fetchPayments, processPayment } = usePayment();
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    fetchPayments(user.role, user.nic);
  }, [user]);

  // Filter pending payments that need action
  useEffect(() => {
    if (payments) {
      const pending = payments.filter(p => p.status === 'PENDING' || p.status === 'WAITING_FOR_PAYMENT');
      setPendingPayments(pending);
    }
  }, [payments]);

  const handlePayNow = (paymentId) => {
    navigate(`/buyer/payments/${paymentId}/process`);
  };

  // Render action cards for pending payments
  const renderPendingPaymentCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {pendingPayments.map((payment) => (
        <Card key={payment.id} className="bg-white">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order #{payment.orderId}</span>
              <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Pending Payment
              </span>
            </CardTitle>
            <CardDescription>
              Due by: {format(new Date(payment.dueDate), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">Rs. {payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span>{payment.farmerName}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handlePayNow(payment.id)}
            >
              Pay Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
      {pendingPayments.length === 0 && (
        <Card className="col-span-full bg-gray-50">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-gray-500">No pending payments</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render payment methods cards
  const renderPaymentMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Bank Transfer</h3>
              <p className="text-sm text-gray-500">Direct bank transfer</p>
            </div>
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Pay when you receive</p>
            </div>
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Online Payment</h3>
              <p className="text-sm text-gray-500">Credit/Debit cards</p>
            </div>
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Dashboard</h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Total Payments</div>
            <div className="text-2xl font-bold">{payments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Pending Payments</div>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="text-2xl font-bold">
              Rs. {payments?.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold">
              {payments?.filter(p => p.status === 'COMPLETED').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>
            Payments that require your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPendingPaymentCards()}
        </CardContent>
      </Card>

      {/* Payment Methods Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Available payment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderPaymentMethods()}
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View all your past payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>#{payment.orderId}</TableCell>
                  <TableCell>{format(new Date(payment.createdAt), 'PPP')}</TableCell>
                  <TableCell>Rs. {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <span className={`
                      px-2 py-1 rounded-full text-sm
                      ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                      ${payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${payment.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/buyer/payments/${payment.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerPaymentDashboard;