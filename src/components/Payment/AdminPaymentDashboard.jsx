import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { paymentService } from '@/services/paymentService';
import { format } from 'date-fns';
import { AlertCircle, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPaymentDashboard = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    searchTerm: '',
    dateRange: '7',
    page: 0,
    size: 10
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getAllPayments({
          ...filters,
          // Only include status and paymentMethod if not 'all'
          ...(filters.status !== 'all' && { status: filters.status }),
          ...(filters.paymentMethod !== 'all' && { paymentMethod: filters.paymentMethod })
        });
        setPayments(Array.isArray(response.content) ? response.content : response);
      } catch (err) {
        setError(err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters]);

  // Calculate statistics from actual data
  const stats = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    pendingPayments: payments.filter(p => p.status === 'PENDING').length,
    completedPayments: payments.filter(p => p.status === 'COMPLETED').length
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => {
    if (!filters.searchTerm) return true;
    
    const searchLower = filters.searchTerm.toLowerCase();
    return (
      payment.orderId?.toString().includes(searchLower) ||
      payment.buyerName?.toLowerCase().includes(searchLower) ||
      payment.farmerName?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusStyle = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      PROCESSING: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadProof = async (paymentId) => {
    try {
      const blob = await paymentService.downloadPaymentProof(paymentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-proof-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download proof:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Total Payments</div>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold">Rs. {stats.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Pending Payments</div>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-gray-500">Completed Payments</div>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Monitor and manage all system payments</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select 
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 0 }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.paymentMethod}
              onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value, page: 0 }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CASH_ON_DELIVERY">Cash on Delivery</SelectItem>
                <SelectItem value="ONLINE_PAYMENT">Online Payment</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value, page: 0 }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search payments..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                searchTerm: e.target.value,
                page: 0
              }))}
            />
          </div>

          {/* Payments Table */}
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payments found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
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
                      <TableCell>{payment.farmerName}</TableCell>
                      <TableCell>Rs. {parseFloat(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
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
                            onClick={() => navigate(`/payments/admin/${payment.id}`)}
                          >
                            View
                          </Button>
                          {payment.proofDocument && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadProof(payment.id)}
                            >
                              <Download className="h-4 w-4" />
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

export default AdminPaymentDashboard;