import { websocketService } from '@/api/websocket/socket'; // Ensure correct path
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useBidNotifications } from '@/hooks/useBidNotifications';
import { formatBidAmount } from '@/utils/bidUtils';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const PlaceBidModal = ({ bid, isOpen, onClose, onBidPlaced }) => {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [recentBids, setRecentBids] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const { showBidPlaced, showBidError } = useBidNotifications();

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
            setIsSubmitting(false);
            setTotalAmount(0);
        }
    }, [isOpen]);

    // Subscribe to real-time bid updates
    useEffect(() => {
        if (!isOpen) return;

        const handleBidUpdate = (data) => {
            if (data.bidId === bid.id) {
                setRecentBids((prev) => [data, ...prev].slice(0, 5)); // Keep last 5 bids
            }
        };

        const unsubscribe = websocketService.subscribe('bidUpdates', handleBidUpdate);
        return () => unsubscribe();
    }, [isOpen, bid.id]);

    // Calculate total amount when bid amount changes
    useEffect(() => {
        const bidAmount = parseFloat(amount);
        if (!isNaN(bidAmount) && bidAmount > 0) {
            setTotalAmount(bidAmount * bid.quantity);
        } else {
            setTotalAmount(0);
        }
    }, [amount, bid.quantity]);

    const validateBid = () => {
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            return 'Please enter a valid bid amount';
        }

        if (numAmount < bid.minimumPrice) {
            return `Minimum bid amount is ${formatBidAmount(bid.minimumPrice)}`;
        }

        // Check for minimum increment over current highest bid
        const currentHighestBid = Math.max(
            bid.currentPrice,
            ...recentBids.map((b) => b.amount)
        );

        if (numAmount <= currentHighestBid) {
            return `Bid must be higher than current highest bid: ${formatBidAmount(currentHighestBid)}`;
        }

        if (bid.minimumBidIncrement) {
            const requiredAmount = currentHighestBid + bid.minimumBidIncrement;
            if (numAmount < requiredAmount) {
                return `Minimum bid increment is ${formatBidAmount(
                    bid.minimumBidIncrement
                )}. Next bid must be at least ${formatBidAmount(requiredAmount)}`;
            }
        }

        return null;
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Validate bid
            const validationError = validateBid();
            if (validationError) {
                setError(validationError);
                setIsSubmitting(false);
                return;
            }

            // Create bid object
            const bidData = {
                bidId: bid.id,
                amount: parseFloat(amount),
                timestamp: new Date().toISOString(),
                quantity: bid.quantity,
            };

            // Send bid through WebSocket
            await websocketService.sendBid(bidData);

            // Show success notification
            showBidPlaced({
                riceVariety: bid.riceVariety,
                amount: parseFloat(amount),
                quantity: bid.quantity,
            });

            // Callback for parent component
            if (onBidPlaced) {
                onBidPlaced(bidData);
            }

            onClose();
        } catch (err) {
            setError(err.message || 'Failed to place bid');
            showBidError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Place Bid</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Bid Information */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500">Rice Variety</p>
                            <p className="font-medium">{bid.riceVariety}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="font-medium">{bid.quantity}kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Current Price</p>
                            <p className="font-medium">{formatBidAmount(bid.currentPrice)}/kg</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Minimum Price</p>
                            <p className="font-medium">{formatBidAmount(bid.minimumPrice)}/kg</p>
                        </div>
                    </div>

                    {/* Recent Bids */}
                    {recentBids.length > 0 && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Bids</h4>
                            <div className="space-y-2">
                                {recentBids.map((recentBid, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span>{formatBidAmount(recentBid.amount)}</span>
                                        </div>
                                        <span className="text-gray-500">
                                            {new Date(recentBid.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bid Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="bidAmount"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Your Bid (per kg)
                        </label>
                        <Input
                            id="bidAmount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={`Min. ${formatBidAmount(bid.minimumPrice)}`}
                            className="w-full"
                            required
                        />
                        {totalAmount > 0 && (
                            <p className="text-sm text-gray-500">
                                Total Amount: {formatBidAmount(totalAmount)}
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <DialogFooter className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !amount}
                            className="min-w-[100px]"
                        >
                            {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

PlaceBidModal.propTypes = {
    bid: PropTypes.shape({
        id: PropTypes.string.isRequired,
        riceVariety: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        currentPrice: PropTypes.number.isRequired,
        minimumPrice: PropTypes.number.isRequired,
        minimumBidIncrement: PropTypes.number,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onBidPlaced: PropTypes.func,
};

export default PlaceBidModal;
