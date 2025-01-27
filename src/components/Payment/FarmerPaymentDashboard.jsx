import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { AlertCircle, FileText, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerPaymentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { payments, loading, error, fetchPayments } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments(user.role, user.nic);
  }, [user]);

  // Calculate summary statistics
  const stats = {
    totalReceived: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    pendingAmount: payments?.filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    completedPayments: payments?.filter(p => p.status === 'COMPLETED').length || 0,
    pendingPayments: payments?.filter(p => p.status === 'PENDING').length || 0
  };

  // Filter payments based on search
  const filteredPayments = payments?.filter(payment => 
    payment.orderId.toString().includes(searchTerm) ||
    payment.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Total Received</div>
            <div className="text-2xl font-bold">Rs. {stats.totalReceived.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Pending Amount</div>
            <div className="text-2xl font-bold">Rs. {stats.pendingAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Completed Payments</div>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Pending Payments</div>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Track all payments received from buyers</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by order ID or buyer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Payments Table */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No payments found</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>#{payment.orderId}</TableCell>
                      <TableCell>{format(new Date(payment.createdAt), 'PPP')}</TableCell>
                      <TableCell>{payment.buyerName}</TableCell>
                      <TableCell>Rs. {payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(payment.status)}`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/farmer/payments/${payment.id}`)}
                          >
                            View
                          </Button>
                          {payment.proofDocument && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/api/payments/${payment.id}/proof`, '_blank')}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerPaymentDashboard;