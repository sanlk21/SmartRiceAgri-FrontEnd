//import React from 'react';
import { BidStatusBadge } from '@/components/shared/BidNotifications';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatBidAmount, getBidTimeLeft } from '@/utils/bidUtils';
import PropTypes from 'prop-types';

const BidSummaryCard = ({ bid, onAction, actionLabel }) => {
    const timeLeft = getBidTimeLeft(bid.expiryDate);

    return (
        <Card className="p-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{bid.riceVariety}</h3>
                    <p className="text-sm text-gray-500">{bid.location}</p>
                </div>
                <BidStatusBadge status={bid.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p>{bid.quantity}kg</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Price per kg</p>
                    <p>{formatBidAmount(bid.minimumPrice)}</p>
                </div>
                {bid.status === 'ACTIVE' && (
                    <div>
                        <p className="text-sm text-gray-500">Time Left</p>
                        <p>{timeLeft}</p>
                    </div>
                )}
            </div>

            {actionLabel && (
                <Button
                    onClick={() => onAction(bid)}
                    className="w-full mt-4"
                    disabled={bid.status !== 'ACTIVE'}
                >
                    {actionLabel}
                </Button>
            )}
        </Card>
    );
};

BidSummaryCard.propTypes = {
    bid: PropTypes.shape({
        riceVariety: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        minimumPrice: PropTypes.number.isRequired,
        expiryDate: PropTypes.string.isRequired,
    }).isRequired,
    onAction: PropTypes.func.isRequired,
    actionLabel: PropTypes.string,
};

export default BidSummaryCard;
