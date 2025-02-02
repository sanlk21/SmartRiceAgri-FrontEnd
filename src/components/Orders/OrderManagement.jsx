import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import OrderList from './OrderList';
import OrderSummary from './OrderSummary';

const OrderManagement = () => {
  const { user } = useAuth();
  const { state, fetchOrders, getFilteredOrders } = useOrders();

  useEffect(() => {
    if (user?.nic) {
      fetchOrders(user.nic, user.role);
    }
  }, [user, fetchOrders]);

  const allOrders = useMemo(() => ({
    active: getFilteredOrders('PENDING_PAYMENT'),
    completed: getFilteredOrders('PAYMENT_COMPLETED'),
    cancelled: getFilteredOrders('CANCELLED')
  }), [getFilteredOrders]);

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-gray-600">
          Please log in to view orders
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {user.role === 'FARMER' ? 'Sales Orders' : 'Purchase Orders'}
        </h1>
      </div>

      {state.loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <OrderSummary orders={state.orders} />

          <Tabs defaultValue="active" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <OrderList orders={allOrders.active} />
            </TabsContent>

            <TabsContent value="completed">
              <OrderList orders={allOrders.completed} />
            </TabsContent>

            <TabsContent value="cancelled">
              <OrderList orders={allOrders.cancelled} />
            </TabsContent>
          </Tabs>

          {state.error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mt-4">
              {state.error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;