// src/components/shared/payments/BidPaymentModal.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatBidAmount } from '@/utils/bidUtils';
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    Wallet
} from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

// PaymentOption Component
const PaymentOption = ({ icon: Icon, title, description, selected, onSelect }) => (
    <Card
        className={`p-4 cursor-pointer transition-colors ${
            selected ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
        }`}
        onClick={onSelect}
    >
        <div className="flex items-center gap-3">
            <Icon className={selected ? 'text-primary' : 'text-gray-500'} />
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    </Card>
);

PaymentOption.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
};

// BidPaymentModal Component
const BidPaymentModal = ({
    bid,
    isOpen,
    onClose,
    onPaymentComplete,
}) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        accountNumber: '',
        bankName: '',
        accountHolderName: '',
    });

    const totalAmount = bid.quantity * bid.winningAmount;
    const paymentDeadline = new Date(bid.paymentDeadline);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000));
            onPaymentComplete();
            onClose();
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const paymentOptions = [
        {
            id: 'card',
            icon: CreditCard,
            title: 'Credit/Debit Card',
            description: 'Pay securely with your card',
        },
        {
            id: 'bank',
            icon: Building2,
            title: 'Bank Transfer',
            description: 'Direct bank transfer',
        },
        {
            id: 'wallet',
            icon: Wallet,
            title: 'Digital Wallet',
            description: 'Pay using your digital wallet',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Rice Variety:</span>
                                <span>{bid.riceVariety}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span>{bid.quantity}kg</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price per kg:</span>
                                <span>{formatBidAmount(bid.winningAmount)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>Total Amount:</span>
                                <span>{formatBidAmount(totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Deadline */}
                    <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                            Payment deadline: {paymentDeadline.toLocaleString()}
                        </AlertDescription>
                    </Alert>

                    {/* Payment Options */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Select Payment Method</h4>
                        <div className="space-y-2">
                            {paymentOptions.map((option) => (
                                <PaymentOption
                                    key={option.id}
                                    {...option}
                                    selected={paymentMethod === option.id}
                                    onSelect={() => setPaymentMethod(option.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-2">
                            <Input
                                placeholder="Card Number"
                                value={paymentDetails.cardNumber}
                                onChange={(e) =>
                                    setPaymentDetails({
                                        ...paymentDetails,
                                        cardNumber: e.target.value,
                                    })
                                }
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="MM/YY"
                                    value={paymentDetails.expiryDate}
                                    onChange={(e) =>
                                        setPaymentDetails({
                                            ...paymentDetails,
                                            expiryDate: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="CVV"
                                    type="password"
                                    value={paymentDetails.cvv}
                                    onChange={(e) =>
                                        setPaymentDetails({
                                            ...paymentDetails,
                                            cvv: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'bank' && (
                        <div className="space-y-2">
                            <Input
                                placeholder="Bank Name"
                                value={paymentDetails.bankName}
                                onChange={(e) =>
                                    setPaymentDetails({
                                        ...paymentDetails,
                                        bankName: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Account Number"
                                value={paymentDetails.accountNumber}
                                onChange={(e) =>
                                    setPaymentDetails({
                                        ...paymentDetails,
                                        accountNumber: e.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Account Holder Name"
                                value={paymentDetails.accountHolderName}
                                onChange={(e) =>
                                    setPaymentDetails({
                                        ...paymentDetails,
                                        accountHolderName: e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⌛</span>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Pay {formatBidAmount(totalAmount)}
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

BidPaymentModal.propTypes = {
    bid: PropTypes.shape({
        riceVariety: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        winningAmount: PropTypes.number.isRequired,
        paymentDeadline: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPaymentComplete: PropTypes.func.isRequired,
};

export default BidPaymentModal;
