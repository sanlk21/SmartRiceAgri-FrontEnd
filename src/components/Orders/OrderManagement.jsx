// src/components/orders/OrderManagement.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderList from './OrderList';

export default function OrderManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === 'FARMER' ? 'Sales Orders' : 'Purchase Orders'}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <OrderList status="PENDING_PAYMENT" />
        </TabsContent>
        <TabsContent value="completed">
          <OrderList status="PAYMENT_COMPLETED" />
        </TabsContent>
        <TabsContent value="cancelled">
          <OrderList status="CANCELLED" />
        </TabsContent>
      </Tabs>
    </div>
  );
}