import { useBidNotifications } from '@/components/shared/BidNotifications';
import BidStatusBadge from '@/components/shared/BidStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bidService } from '../../../services/bidService';
import { formatBidAmount } from '../../../utils/bidUtils';

const FarmerBidDetails = () => {
    const [bid, setBid] = useState(null);
    const { id } = useParams();
    const { showBidNotification } = useBidNotifications();

    useEffect(() => {
        const fetchBidDetails = async () => {
            try {
                const data = await bidService.getBidDetails(id);
                setBid(data);
            } catch (error) {
                console.error('Error fetching bid details:', error);
            }
        };
        fetchBidDetails();
    }, [id]);

    const handleAcceptOffer = async (offer) => {
        try {
            await bidService.acceptBidOffer(bid.id, offer.buyerNic);
            showBidNotification('success', 'Offer accepted successfully');
            // Refresh bid details
            const updatedBid = await bidService.getBidDetails(id);
            setBid(updatedBid);
        } catch (error) {
            showBidNotification('error', 'Failed to accept offer');
        }
    };

    if (!bid) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Bid Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Rice Variety</h3>
                            <p>{bid.riceVariety}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Quantity</h3>
                            <p>{bid.quantity}kg</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Minimum Price</h3>
                            <p>{formatBidAmount(bid.minimumPrice)}/kg</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Status</h3>
                            <BidStatusBadge status={bid.status} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Bid Offers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {bid.bidOffers.map((offer, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p>Amount: {formatBidAmount(offer.bidAmount)}/kg</p>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(offer.bidDate), 'PPpp')}
                                        </p>
                                    </div>
                                    {bid.status === 'ACTIVE' && (
                                        <Button
                                            onClick={() => handleAcceptOffer(offer)}
                                            variant="outline"
                                        >
                                            Accept Offer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {bid.bidOffers.length === 0 && (
                            <p className="text-center text-gray-500">No offers yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerBidDetails;
