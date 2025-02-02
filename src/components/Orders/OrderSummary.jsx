import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const OrderSummary = ({ orders }) => {
  const calculateStats = () => {
    const pendingCount = orders.filter(o => o.status === 'PENDING_PAYMENT').length;
    const completedCount = orders.filter(o => o.status === 'PAYMENT_COMPLETED').length;
    const totalAmount = orders
      .filter(o => o.status === 'PAYMENT_COMPLETED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      pending: pendingCount,
      completed: completedCount,
      total: orders.length,
      totalAmount
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            All time orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting payment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rs. {stats.totalAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            From completed orders
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;