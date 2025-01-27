import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePayment } from '@/context/PaymentContext';
import { AlertCircle, CreditCard, Lock } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnlinePayment = ({ payment }) => {
  const navigate = useNavigate();
  const { processPayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'visa'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await processPayment(payment.id, 'ONLINE_PAYMENT', {
        ...formData,
        amount: payment.amount,
        orderId: payment.orderId
      });
      navigate(`/payments/${payment.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Amount to Pay</h3>
              <p className="text-sm text-gray-500">Secure online payment</p>
            </div>
            <p className="text-2xl font-bold">Rs. {payment.amount.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Card Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4" />
            <p className="text-sm text-gray-500">Your payment information is secure</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cardType">Card Type</Label>
              <Select
                value={formData.cardType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cardType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    cardNumber: formatCardNumber(e.target.value)
                  }))}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="Name as shown on card"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString().slice(-2);
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : `Pay Rs. ${payment.amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

OnlinePayment.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    orderId: PropTypes.string.isRequired,
  }).isRequired,
};

export default OnlinePayment;