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
import { Textarea } from '@/components/ui/textarea';
import { usePayment } from '@/context/PaymentContext';
import { AlertCircle, Truck } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CashOnDelivery = ({ payment }) => {
  const navigate = useNavigate();
  const { processPayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    city: '',
    district: '',
    contactNumber: '',
    preferredTime: 'morning',
    notes: '',
    alternateContact: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await processPayment(payment.id, 'CASH_ON_DELIVERY', {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Amount to Pay</h3>
              <p className="text-sm text-gray-500">To be paid upon delivery</p>
            </div>
            <p className="text-2xl font-bold">Rs. {payment.amount.toFixed(2)}</p>
          </div>
          <Alert>
            <Truck className="h-4 w-4" />
            <AlertDescription>
              Payment will be collected in cash when your order is delivered
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Delivery Details</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                placeholder="Enter your complete delivery address"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Primary Contact</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alternateContact">Alternate Contact (Optional)</Label>
                <Input
                  id="alternateContact"
                  value={formData.alternateContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, alternateContact: e.target.value }))}
                  placeholder="Alternate mobile number"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Preferences */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Delivery Preferences</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="preferredTime">Preferred Delivery Time</Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special instructions for delivery"
              />
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
          {loading ? 'Processing...' : 'Confirm Order'}
        </Button>
      </div>
    </form>
  );
};

CashOnDelivery.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    orderId: PropTypes.string.isRequired,
  }).isRequired,
};

export default CashOnDelivery;