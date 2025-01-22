import BidStatusBadge from '@/components/shared/BidStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { bidService } from '@/services/bidService';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BidDetails = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    const fetchBidsByFarmerNic = async () => {
        if (!user?.nic) {
            setError('Farmer NIC not found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            console.log(`Fetching bids for Farmer NIC: ${user.nic}`);
            const data = await bidService.getFarmerBids(user.nic);
            setBids(data);
        } catch (error) {
            console.error('Error fetching bids:', error);
            setError(error.message || 'Failed to fetch bids.');
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to fetch bids.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBidsByFarmerNic();
    }, [user]);

    const handleAcceptOffer = async (bidId, offer) => {
        try {
            await bidService.acceptBidOffer(bidId, offer.buyerNic);
            toast({
                title: 'Success',
                description: 'Offer accepted successfully',
            });
            await fetchBidsByFarmerNic();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to accept offer.',
            });
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );
    }

    if (bids.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-gray-500">No bids found for this farmer.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Your Bids</h1>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>

            {bids.map((bid) => (
                <Card key={bid.id}>
                    <CardHeader>
                        <CardTitle>Bid Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">Rice Variety</h3>
                                <p>{bid.riceVariety}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Quantity</h3>
                                <p>{bid.quantity} kg</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Minimum Price</h3>
                                <p>{formatPrice(bid.minimumPrice)}/kg</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Status</h3>
                                <BidStatusBadge status={bid.status} />
                            </div>
                            {bid.createdAt && (
                                <div>
                                    <h3 className="font-semibold">Created Date</h3>
                                    <p>{format(new Date(bid.createdAt), 'PPpp')}</p>
                                </div>
                            )}
                            {bid.expiryDate && (
                                <div>
                                    <h3 className="font-semibold">Expiry Date</h3>
                                    <p>{format(new Date(bid.expiryDate), 'PPpp')}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-4">
                            <h3 className="font-semibold">Bid Offers</h3>
                            {bid.bidOffers?.length > 0 ? (
                                bid.bidOffers.map((offer, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p>Amount: {formatPrice(offer.bidAmount)}/kg</p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(offer.bidDate), 'PPpp')}
                                                </p>
                                            </div>
                                            {bid.status === 'ACTIVE' && (
                                                <Button
                                                    onClick={() => handleAcceptOffer(bid.id, offer)}
                                                    variant="outline"
                                                >
                                                    Accept Offer
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No offers yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default BidDetails;
