// src/components/shared/BidConfirmationModal.jsx
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
import { AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import BidConfirmationTerms from './BidConfirmationTerms';

const BidConfirmationModal = ({ 
    bidDetails, 
    isOpen, 
    onClose, 
    onConfirm,
    isSubmitting 
}) => {
    const [countdown, setCountdown] = useState(5);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    // Auto-countdown timer
    useEffect(() => {
        if (!isOpen || !hasAcceptedTerms) {
            setCountdown(5);
            return;
        }

        if (countdown === 0) {
            onConfirm();
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, countdown, hasAcceptedTerms, onConfirm]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setHasAcceptedTerms(false);
            setCountdown(5);
            setShowSummary(true);
        }
    }, [isOpen]);

    const getTotalAmount = () => {
        return bidDetails.amount * bidDetails.quantity;
    };

    const getBidRiskLevel = () => {
        const totalAmount = getTotalAmount();
        const marketPrice = bidDetails.marketAverage * bidDetails.quantity;

        if (totalAmount > marketPrice * 1.2) {
            return {
                level: 'high',
                message: 'Your bid is significantly above market average',
                icon: AlertTriangle,
                color: 'text-red-500'
            };
        }

        if (totalAmount > marketPrice * 1.1) {
            return {
                level: 'medium',
                message: 'Your bid is moderately above market average',
                icon: Info,
                color: 'text-yellow-500'
            };
        }

        return {
            level: 'low',
            message: 'Your bid is within market range',
            icon: CheckCircle2,
            color: 'text-green-500'
        };
    };

    const risk = getBidRiskLevel();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Confirm Your Bid
                        <risk.icon className={`h-5 w-5 ${risk.color}`} />
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Bid Summary */}
                    {showSummary && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <h4 className="font-medium">Bid Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p className="text-gray-500">Rice Variety:</p>
                                <p>{bidDetails.riceVariety}</p>
                                <p className="text-gray-500">Quantity:</p>
                                <p>{bidDetails.quantity} kg</p>
                                <p className="text-gray-500">Your Bid:</p>
                                <p>{formatBidAmount(bidDetails.amount)}/kg</p>
                                <p className="text-gray-500 font-medium">Total Amount:</p>
                                <p className="font-medium">{formatBidAmount(getTotalAmount())}</p>
                            </div>
                        </div>
                    )}

                    {/* Market Analysis */}
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Market Analysis</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-500">Market Average:</p>
                            <p>{formatBidAmount(bidDetails.marketAverage)}/kg</p>
                            <p className="text-gray-500">Highest Bid Today:</p>
                            <p>{formatBidAmount(bidDetails.highestBid)}/kg</p>
                            <p className="text-gray-500">Your Position:</p>
                            <p className={risk.color}>{risk.message}</p>
                        </div>
                    </div>

                    {/* Risk Alert */}
                    <Alert variant={risk.level === 'high' ? 'destructive' : 'default'}>
                        <risk.icon className="h-4 w-4" />
                        <AlertDescription>
                            {risk.message}. Are you sure you want to proceed?
                        </AlertDescription>
                    </Alert>

                    {/* Terms and Conditions */}
                    <BidConfirmationTerms
                        onAccept={setHasAcceptedTerms}
                        accepted={hasAcceptedTerms}
                    />

                    {/* Action Buttons */}
                    <DialogFooter className="space-x-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isSubmitting || !hasAcceptedTerms}
                            className="min-w-[120px] relative"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Confirming...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Confirm
                                    {hasAcceptedTerms && (
                                        <Clock className="h-4 w-4" />
                                    )}
                                    {hasAcceptedTerms && countdown > 0 && (
                                        <span>({countdown})</span>
                                    )}
                                </div>
                            )}
                        </Button>
                    </DialogFooter>

                    {/* Auto-confirm Notice */}
                    {hasAcceptedTerms && countdown > 0 && (
                        <p className="text-xs text-center text-gray-500">
                            Bid will be auto-confirmed in {countdown} seconds. Click Cancel to stop.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

BidConfirmationModal.propTypes = {
    bidDetails: PropTypes.shape({
        riceVariety: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
        marketAverage: PropTypes.number.isRequired,
        highestBid: PropTypes.number.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
};

export default BidConfirmationModal;