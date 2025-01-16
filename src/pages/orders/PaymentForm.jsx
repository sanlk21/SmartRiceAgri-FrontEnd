import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { paymentService } from '@/services/paymentService';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';

const PaymentForm = ({ order, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    // Bank Transfer fields
    senderBankName: '',
    senderAccountNumber: '',
    senderAccountName: '',
    transferDate: '',
    proofDocument: null,

    // Cash on Delivery fields
    deliveryAddress: '',
    scheduledDeliveryDate: '',
    deliveryAgentName: '',
    deliveryContactNumber: '',

    // Online Payment fields
    gatewayName: '',
    transactionId: '',
    gatewayStatus: ''
  });

  const [paymentType, setPaymentType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      proofDocument: file
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Initialize payment
      const payment = await paymentService.initializePayment(order.id, paymentType);

      // Process based on payment type
      switch (paymentType) {
        case 'BANK_TRANSFER':
          await paymentService.processBankTransfer(
            payment.id,
            {
              senderBankName: formData.senderBankName,
              senderAccountNumber: formData.senderAccountNumber,
              senderAccountName: formData.senderAccountName,
              transferDate: formData.transferDate
            },
            formData.proofDocument
          );
          break;

        case 'CASH_ON_DELIVERY':
          await paymentService.processCashOnDelivery(payment.id, {
            deliveryAddress: formData.deliveryAddress,
            scheduledDeliveryDate: formData.scheduledDeliveryDate,
            deliveryAgentName: formData.deliveryAgentName,
            deliveryContactNumber: formData.deliveryContactNumber
          });
          break;

        case 'ONLINE_PAYMENT':
          await paymentService.processOnlinePayment(payment.id, {
            gatewayName: formData.gatewayName,
            transactionId: formData.transactionId,
            gatewayStatus: 'INITIATED'
          });
          break;
          
        default:
          throw new Error('Invalid payment type selected');
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBankTransferForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Bank Name</label>
        <Input
          name="senderBankName"
          value={formData.senderBankName}
          onChange={(e) => setFormData({ ...formData, senderBankName: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <Input
          name="senderAccountNumber"
          value={formData.senderAccountNumber}
          onChange={(e) => setFormData({ ...formData, senderAccountNumber: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Account Holder Name</label>
        <Input
          name="senderAccountName"
          value={formData.senderAccountName}
          onChange={(e) => setFormData({ ...formData, senderAccountName: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Transfer Date</label>
        <Input
          type="datetime-local"
          name="transferDate"
          value={formData.transferDate}
          onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Proof</label>
        <Input
          type="file"
          onChange={onFileChange}
          accept="image/*,.pdf"
          required
        />
      </div>
    </div>
  );

  const renderCashOnDeliveryForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Delivery Address</label>
        <Input
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Scheduled Delivery Date</label>
        <Input
          type="datetime-local"
          name="scheduledDeliveryDate"
          value={formData.scheduledDeliveryDate}
          onChange={(e) => setFormData({ ...formData, scheduledDeliveryDate: e.target.value })}
          required
        />
      </div>
    </div>
  );

  const renderOnlinePaymentForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Payment Gateway</label>
        <Select
          value={formData.gatewayName}
          onChange={(e) => setFormData({ ...formData, gatewayName: e.target.value })}
          required
        >
          <option value="">Select Payment Gateway</option>
          <option value="PAYPAL">PayPal</option>
          <option value="STRIPE">Stripe</option>
        </Select>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Payment for Order #{order.orderNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Amount to Pay</label>
            <p className="text-2xl font-bold">Rs. {order.totalAmount}</p>
            <p className="text-sm text-gray-500">
              Payment Deadline: {format(new Date(order.paymentDeadline), 'PPp')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <Select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="ONLINE_PAYMENT">Online Payment</option>
            </Select>
          </div>

          {paymentType === 'BANK_TRANSFER' && renderBankTransferForm()}
          {paymentType === 'CASH_ON_DELIVERY' && renderCashOnDeliveryForm()}
          {paymentType === 'ONLINE_PAYMENT' && renderOnlinePaymentForm()}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

PaymentForm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderNumber: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    paymentDeadline: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
  onClose: PropTypes.func
};

PaymentForm.defaultProps = {
  onSuccess: () => {},
  onClose: () => {}
};

export default PaymentForm;