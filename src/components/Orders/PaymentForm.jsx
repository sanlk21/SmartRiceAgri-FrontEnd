import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paymentService } from '@/services/paymentService';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const generateReferenceCode = (method) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  const methodPrefix = {
    'BANK_TRANSFER': 'BTR',
    'CASH_ON_DELIVERY': 'COD',
    'ONLINE_PAYMENT': 'ONP'
  }[method] || 'PAY';

  return `${methodPrefix}${year}${month}${day}${hours}${minutes}${seconds}${random}`;
};

const PaymentForm = ({ order, onClose = () => {}, onSuccess = () => {} }) => {
  const [currentPaymentId, setCurrentPaymentId] = useState(null);
  const [formData, setFormData] = useState({
    paymentMethod: '',
    transactionReference: '',
    // Bank transfer fields
    senderBankName: '',
    senderAccountNumber: '',
    senderAccountName: '',
    transferDate: '',
    proofFile: null,
    // Cash on delivery fields
    deliveryAddress: '',
    scheduledDeliveryDate: '',
    deliveryAgentName: '',
    deliveryContactNumber: '',
    // Online payment fields
    paymentGatewayName: '',
    paymentGatewayTransactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formData.paymentMethod) {
      setFormData(prev => ({
        ...prev,
        transactionReference: generateReferenceCode(formData.paymentMethod)
      }));
    }
  }, [formData.paymentMethod]);

  const validateForm = () => {
    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    switch (formData.paymentMethod) {
      case 'BANK_TRANSFER':
        if (!formData.senderBankName || 
            !formData.senderAccountNumber || 
            !formData.senderAccountName || 
            !formData.transferDate || 
            !formData.proofFile) {
          setError('Please fill in all bank transfer details and upload proof');
          return false;
        }
        break;

      case 'CASH_ON_DELIVERY':
        if (!formData.deliveryAddress || 
            !formData.scheduledDeliveryDate || 
            !formData.deliveryAgentName || 
            !formData.deliveryContactNumber) {
          setError('Please fill in all delivery details');
          return false;
        }
        break;

      case 'ONLINE_PAYMENT':
        if (!formData.paymentGatewayName) {
          setError('Please select a payment gateway');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Initialize payment
      let paymentId = currentPaymentId;
      if (!paymentId) {
        const initializedPayment = await paymentService.initializePayment(
          order.id,
          formData.paymentMethod
        );
        paymentId = initializedPayment.id;
        setCurrentPaymentId(paymentId);
      }

      // Step 2: Process payment based on method
      switch (formData.paymentMethod) {
        case 'BANK_TRANSFER': {
          const bankData = {
            senderBankName: formData.senderBankName,
            senderAccountNumber: formData.senderAccountNumber,
            senderAccountName: formData.senderAccountName,
            transferDate: formData.transferDate,
            transactionReference: formData.transactionReference
          };
          await paymentService.processBankTransfer(
            paymentId,
            bankData,
            formData.proofFile
          );
          break;
        }

        case 'CASH_ON_DELIVERY': {
          const codData = {
            deliveryAddress: formData.deliveryAddress,
            scheduledDeliveryDate: formData.scheduledDeliveryDate,
            deliveryAgentName: formData.deliveryAgentName,
            deliveryContactNumber: formData.deliveryContactNumber,
            transactionReference: formData.transactionReference
          };
          await paymentService.processCashOnDelivery(paymentId, codData);
          break;
        }

        case 'ONLINE_PAYMENT': {
          const onlineData = {
            gatewayName: formData.paymentGatewayName,
            transactionId: formData.transactionReference,
            gatewayStatus: 'PENDING'
          };
          await paymentService.processOnlinePayment(paymentId, onlineData);
          break;
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      if (err.name === 'PaymentError') {
        setError(`Payment failed: ${err.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        proofFile: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset form fields when payment method changes
      ...(name === 'paymentMethod' && {
        senderBankName: '',
        senderAccountNumber: '',
        senderAccountName: '',
        transferDate: '',
        proofFile: null,
        deliveryAddress: '',
        scheduledDeliveryDate: '',
        deliveryAgentName: '',
        deliveryContactNumber: '',
        paymentGatewayName: '',
        paymentGatewayTransactionId: ''
      })
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
            <p className="text-2xl font-bold">Rs. {order.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              Payment Deadline: {format(new Date(order.paymentDeadline), 'PPp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CASH_ON_DELIVERY">Cash on Delivery</SelectItem>
                <SelectItem value="ONLINE_PAYMENT">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod && (
            <div className="space-y-2">
              <Label>Transaction Reference</Label>
              <Input
                name="transactionReference"
                value={formData.transactionReference}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">
                Auto-generated reference number for your {formData.paymentMethod.toLowerCase().replace('_', ' ')} payment
              </p>
            </div>
          )}

          {formData.paymentMethod === 'BANK_TRANSFER' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>Payment Proof</Label>
                <Input
                  type="file"
                  name="proofFile"
                  onChange={handleChange}
                  accept="image/*,.pdf"
                  required
                />
                <p className="text-sm text-gray-500">
                  Upload bank transfer receipt or screenshot (PDF or image)
                </p>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'CASH_ON_DELIVERY' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Input
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Delivery Date</Label>
                <Input
                  type="datetime-local"
                  name="scheduledDeliveryDate"
                  value={formData.scheduledDeliveryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Agent Name</Label>
                  <Input
                    name="deliveryAgentName"
                    value={formData.deliveryAgentName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    name="deliveryContactNumber"
                    value={formData.deliveryContactNumber}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'ONLINE_PAYMENT' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Gateway</Label>
                <Select
                  value={formData.paymentGatewayName}
                  onValueChange={(value) => handleSelectChange('paymentGatewayName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                    <SelectItem value="STRIPE">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.paymentMethod}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Processing...
                </span>
              ) : (
                'Submit Payment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;