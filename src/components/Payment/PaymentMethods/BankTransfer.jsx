import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePayment } from '@/context/PaymentContext';
import { AlertCircle, Upload } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BankTransfer = ({ payment }) => {
  const navigate = useNavigate();
  const { processPayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    proofDocument: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        proofDocument: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await processPayment(payment.id, 'BANK_TRANSFER', formData);
      navigate(`/payments/${payment.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bank Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Payment Proof */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Payment Proof</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="proofDocument">Upload Payment Slip</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="proofDocument"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="proofDocument" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {formData.proofDocument ? formData.proofDocument.name : 'Click to upload payment proof'}
                  </p>
                </label>
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

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </div>
    </form>
  );
};

BankTransfer.propTypes = {
  payment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default BankTransfer;