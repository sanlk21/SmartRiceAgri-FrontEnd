import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useOrders } from '@/context/OrderContext';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';

const PaymentForm = ({ order, onClose, onSuccess }) => {
  const { updatePayment } = useOrders();
  const [formData, setFormData] = useState({
    paymentMethod: '',
    paymentReference: '',
    // Bank transfer fields
    senderBankName: '',
    senderAccountNumber: '',
    senderAccountName: '',
    transferDate: '',
    // Online payment fields
    paymentGatewayName: '',
    paymentGatewayTransactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePayment(order.id, formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label>Amount to Pay</Label>
            <p className="text-2xl font-bold">Rs. {order.totalAmount}</p>
            <p className="text-sm text-gray-500">
              Payment Deadline: {format(new Date(order.paymentDeadline), 'PPp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="ONLINE_PAYMENT">Online Payment</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </Select>
          </div>

          {formData.paymentMethod === 'BANK_TRANSFER' && (
            <>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  name="senderBankName"
                  value={formData.senderBankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  name="senderAccountNumber"
                  value={formData.senderAccountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Account Holder Name</Label>
                <Input
                  name="senderAccountName"
                  value={formData.senderAccountName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Transfer Date</Label>
                <Input
                  type="datetime-local"
                  name="transferDate"
                  value={formData.transferDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {formData.paymentMethod === 'ONLINE_PAYMENT' && (
            <>
              <div className="space-y-2">
                <Label>Payment Gateway</Label>
                <Select
                  name="paymentGatewayName"
                  value={formData.paymentGatewayName}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gateway</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="STRIPE">Stripe</option>
                </Select>
              </div>
            </>
          )}

          {formData.paymentMethod && (
            <div className="space-y-2">
              <Label>Payment Reference</Label>
              <Input
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleChange}
                placeholder="Enter payment reference number"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Payment'}
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
    totalAmount: PropTypes.number.isRequired,
    paymentDeadline: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

PaymentForm.defaultProps = {
  onSuccess: () => {}
};

export default PaymentForm;