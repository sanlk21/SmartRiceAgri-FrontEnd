import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bank, CreditCard, Truck } from 'lucide-react';
import PropTypes from 'prop-types';
import BankTransfer from '../PaymentMethods/BankTransfer';
import CashOnDelivery from '../PaymentMethods/CashOnDelivery';
import OnlinePayment from '../PaymentMethods/OnlinePayment';

const PaymentOptions = ({ payment, onClose }) => {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Select Payment Method</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Amount to Pay</p>
              <p className="text-2xl font-bold">Rs. {payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">#{payment.orderId}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="bank_transfer">
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="bank_transfer" className="flex gap-2">
              <Bank className="w-4 h-4" />
              Bank Transfer
            </TabsTrigger>
            <TabsTrigger value="cash_delivery" className="flex gap-2">
              <Truck className="w-4 h-4" />
              Cash on Delivery
            </TabsTrigger>
            <TabsTrigger value="online" className="flex gap-2">
              <CreditCard className="w-4 h-4" />
              Online Payment
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="bank_transfer">
              <BankTransfer payment={payment} />
            </TabsContent>
            <TabsContent value="cash_delivery">
              <CashOnDelivery payment={payment} />
            </TabsContent>
            <TabsContent value="online">
              <OnlinePayment payment={payment} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

PaymentOptions.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default PaymentOptions;