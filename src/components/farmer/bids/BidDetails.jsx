import BidStatusBadge from '@/components/shared/BidStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bidService } from '../../../services/bidService';


const BidDetails = () => {
    const [bid, setBid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { bidId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    const fetchBidDetails = useCallback(async () => {
        if (!bidId) {
            setError('No bid ID provided');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await bidService.getBidDetails(bidId);
            setBid(data);
        } catch (error) {
            console.error('Error fetching bid details:', error);
            setError(error.message || 'Failed to fetch bid details');
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || 'Failed to fetch bid details'
            });
        } finally {
            setLoading(false);
        }
    }, [bidId, toast]);

    useEffect(() => {
        fetchBidDetails();
    }, [fetchBidDetails]);

    const handleAcceptOffer = async (offer) => {
        try {
            await bidService.acceptBidOffer(bid.id, offer.buyerNic);
            toast({
                title: "Success",
                description: "Offer accepted successfully"
            });
            await fetchBidDetails();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to accept offer"
            });
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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

    if (!bid) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bid Details</h1>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>

            <Card>
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
                </CardContent>
            </Card>

            {user?.role === 'FARMER' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bid Offers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
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
                                                    onClick={() => handleAcceptOffer(offer)}
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
            )}
        </div>
    );
};

export default BidDetails;