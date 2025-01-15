// src/components/shared/BidWinningNotificationModal.jsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import { Clock, CreditCard, Trophy } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const BidWinningNotificationModal = ({ bid, isOpen, onClose, onProceedToPayment }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!isOpen || !bid.paymentDeadline) return;

        const updateTimeLeft = () => {
            const now = new Date();
            const deadline = new Date(bid.paymentDeadline);
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}h ${minutes}m`);
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 60000);

        return () => clearInterval(interval);
    }, [isOpen, bid.paymentDeadline]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Congratulations!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Winning Message */}
                    <div className="text-center">
                        <p className="text-lg">
                            You won the bid for {bid.quantity}kg of {bid.riceVariety}!
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Your winning bid: {formatBidAmount(bid.winningAmount)}/kg
                        </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Order Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-500">Quantity:</p>
                            <p className="text-right">{bid.quantity}kg</p>
                            <p className="text-gray-500">Price per kg:</p>
                            <p className="text-right">{formatBidAmount(bid.winningAmount)}</p>
                            <p className="text-gray-500 font-medium">Total Amount:</p>
                            <p className="text-right font-medium">
                                {formatBidAmount(bid.quantity * bid.winningAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Payment Deadline */}
                    <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                            Payment deadline: {format(new Date(bid.paymentDeadline), 'PPp')}
                            {timeLeft && ` (${timeLeft} remaining)`}
                        </AlertDescription>
                    </Alert>

                    {/* Next Steps */}
                    <div className="space-y-2">
                        <h4 className="font-medium">Next Steps:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            <li>Complete the payment within the deadline</li>
                            <li>Contact the seller for collection arrangements</li>
                            <li>Verify the quality and quantity upon collection</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <DialogFooter className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            View Later
                        </Button>
                        <Button
                            onClick={onProceedToPayment}
                            className="gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            Proceed to Payment
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

BidWinningNotificationModal.propTypes = {
    bid: PropTypes.shape({
        riceVariety: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        winningAmount: PropTypes.number.isRequired,
        paymentDeadline: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onProceedToPayment: PropTypes.func.isRequired,
};

export default BidWinningNotificationModal;