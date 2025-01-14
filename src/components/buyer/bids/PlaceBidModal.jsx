import { useBidNotifications } from '@/components/shared/BidNotifications';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { bidService } from '../../../services/bidService';
import { formatBidAmount } from '../../../utils/bidUtils';
import { validateBidOffer } from '../../../validation/bidValidation';

const PlaceBidModal = ({ bid, isOpen, onClose, onPlaceBid }) => {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showBidNotification } = useBidNotifications();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const bidAmount = parseFloat(amount);
            const validation = validateBidOffer({ bidAmount }, bid);

            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors)[0]);
            }

            await bidService.placeBid(bid.id, bidAmount);
            showBidNotification('success', 'Bid placed successfully');
            onClose();
            if (onPlaceBid) onPlaceBid();
        } catch (error) {
            showBidNotification('error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Place Bid</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Bid Details</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <p className="text-sm text-gray-500">Rice Variety</p>
                                <p className="font-medium">{bid.riceVariety}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Quantity</p>
                                <p className="font-medium">{bid.quantity}kg</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Minimum Price</p>
                                <p className="font-medium">{formatBidAmount(bid.minimumPrice)}/kg</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bidAmount">Your Bid (per kg)</label>
                        <Input
                            id="bidAmount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={bid.minimumPrice}
                            step="0.01"
                            required
                            className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {formatBidAmount(parseFloat(amount || 0) * bid.quantity)}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

PlaceBidModal.propTypes = {
    bid: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPlaceBid: PropTypes.func,
};

export default PlaceBidModal;
