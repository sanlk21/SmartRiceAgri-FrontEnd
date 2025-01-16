import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useOrders } from '@/context/OrderContext';
import PropTypes from 'prop-types';
import { useState } from 'react';

const PaymentForm = ({ order, onClose }) => {
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
            <label className="block text-sm font-medium mb-1">Payment Method</label>
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
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name</label>
                <Input
                  name="senderBankName"
                  value={formData.senderBankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <Input
                  name="senderAccountNumber"
                  value={formData.senderAccountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <Input
                  name="senderAccountName"
                  value={formData.senderAccountName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transfer Date</label>
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
              <div>
                <label className="block text-sm font-medium mb-1">Gateway Name</label>
                <Input
                  name="paymentGatewayName"
                  value={formData.paymentGatewayName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <Input
                  name="paymentGatewayTransactionId"
                  value={formData.paymentGatewayTransactionId}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
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
    status: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default PaymentForm;