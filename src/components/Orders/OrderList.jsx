import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import React, { memo, useState } from 'react';
import OrderDetails from './OrderDetails';
import PaymentForm from './PaymentForm';

const OrderList = memo(({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { user } = useAuth();
  
  const isBuyer = user?.role === 'BUYER';

  const handlePayNow = (order) => {
    setSelectedOrder(order);
    setShowPaymentForm(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowPaymentForm(false);
  };

  const handleClosePayment = () => {
    setSelectedOrder(null);
    setShowPaymentForm(false);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'PENDING_PAYMENT': 'bg-yellow-100 text-yellow-800',
      'PAYMENT_COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    {format(new Date(order.orderDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{order.quantity}kg</TableCell>
                  <TableCell className="text-right">
                    Rs. {order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        Details
                      </Button>
                      {isBuyer && order.status === 'PENDING_PAYMENT' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handlePayNow(order)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!orders || orders.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      No orders found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal for Order Details and Payment */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg">
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <Button variant="outline" size="sm" onClick={handleClosePayment}>
                  Close
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <OrderDetails
                  order={selectedOrder}
                  showPaymentForm={showPaymentForm}
                />
                
                {isBuyer && !showPaymentForm && selectedOrder.status === 'PENDING_PAYMENT' && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setShowPaymentForm(true)}>
                      Proceed to Payment
                    </Button>
                  </div>
                )}

                {showPaymentForm && (
                  <div className="mt-6">
                    <PaymentForm
                      order={selectedOrder}
                      onClose={() => setShowPaymentForm(false)}
                      onSuccess={() => {
                        handleClosePayment();
                        // Refresh orders list
                        window.location.reload();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

OrderList.displayName = 'OrderList';

export default OrderList;