//import React from 'react';
import { BidStatusBadge } from '@/components/shared/BidNotifications';
import { Button } from '@/components/ui/button';
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const BidHistoryTable = ({ bids }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Rice Variety</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid) => (
                        <tr key={bid.id} className="border-b">
                            <td className="p-2">{format(new Date(bid.postedDate), 'MMM dd, yyyy')}</td>
                            <td className="p-2">{bid.riceVariety}</td>
                            <td className="p-2">{bid.quantity}kg</td>
                            <td className="p-2">{formatBidAmount(bid.minimumPrice)}</td>
                            <td className="p-2">
                                <BidStatusBadge status={bid.status} />
                            </td>
                            <td className="p-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`/bids/${bid.id}`, '_blank')}
                                >
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

BidHistoryTable.propTypes = {
    bids: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            postedDate: PropTypes.string.isRequired,
            riceVariety: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            minimumPrice: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default BidHistoryTable;
