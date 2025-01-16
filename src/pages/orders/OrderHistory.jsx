import OrderList from '@/components/Orders/OrderList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useEffect, useState } from 'react';

const OrderHistory = () => {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders();
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '30',
    searchTerm: '',
  });

  useEffect(() => {
    if (user) {
      fetchOrders(user.role, user.nic);
    }
  }, [user, fetchOrders]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const daysAgo = new Date(today.setDate(today.getDate() - parseInt(filters.dateRange)));
      if (orderDate < daysAgo) {
        return false;
      }
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="PAYMENT_COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </Select>

            <Input
              placeholder="Search orders..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>

          <OrderList 
            orders={filteredOrders}
            userRole={user?.role}
            onPaymentClick={() => {}}
          />

          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;