import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { bidService } from '@/services/bidService';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BidDetails = () => {
    const { bidId } = useParams();
    const [bid, setBid] = useState(null);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (bidId) {
            fetchBidDetails();
        } else {
            setError('Invalid bid ID');
            setLoading(false);
        }
    }, [bidId]);

    const fetchBidDetails = async () => {
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
    };

    const handleAcceptOffer = async () => {
        if (!selectedOffer) return;
    
        try {
            setActionLoading(true);
            setShowAcceptDialog(false); // Close dialog immediately
    
            const response = await bidService.acceptBidOffer(bidId, selectedOffer.buyerNic);
            
            // Show success message
            toast({
                title: "Success",
                description: "Offer accepted successfully. Creating order...",
            });
    
            // Refresh bid details
            await fetchBidDetails();
    
            // Navigate to orders after delay
            setTimeout(() => {
                navigate('/farmer/orders');
            }, 1500);
        } catch (error) {
            console.error('Error accepting offer:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to accept offer"
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleBack = () => {
        const backPath = user.role === 'FARMER' 
            ? '/farmer/bids/list'
            : user.role === 'BUYER'
            ? '/buyer/bids/available'
            : '/admin/bids/dashboard';
        navigate(backPath);
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                            <Button
                                onClick={fetchBidDetails}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!bid) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">Bid not found</p>
                        <Button
                            variant="outline"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={handleBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h2 className="text-2xl font-bold">Bid Details</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bid Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-500">Rice Variety</h3>
                            <p className="mt-1">{bid.riceVariety}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Quantity</h3>
                            <p className="mt-1">{bid.quantity} kg</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Minimum Price</h3>
                            <p className="mt-1">{formatPrice(bid.minimumPrice)}/kg</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Status</h3>
                            <p className={`mt-1 inline-flex px-2 py-1 rounded-full text-sm ${
                                bid.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                bid.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {bid.status}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Posted Date</h3>
                            <p className="mt-1">{formatDateTime(bid.postedDate)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500">Location</h3>
                            <p className="mt-1">{bid.location}</p>
                        </div>
                    </div>

                    {bid.description && (
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-500">Description</h3>
                            <p className="mt-1">{bid.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bid Offers Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Bid Offers</CardTitle>
                </CardHeader>
                <CardContent>
                    {bid.bidOffers && bid.bidOffers.length > 0 ? (
                        <div className="space-y-4">
                            {bid.bidOffers.map((offer, index) => (
                                <div key={index} 
                                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium">
                                            Amount: {formatPrice(offer.bidAmount)}/kg
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDateTime(offer.bidDate)}
                                        </p>
                                    </div>
                                    {user.role === 'FARMER' && bid.status === 'ACTIVE' && (
                                        <Button
                                            onClick={() => {
                                                setSelectedOffer(offer);
                                                setShowAcceptDialog(true);
                                            }}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Accept Offer'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No offers yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Accept Offer Dialog */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accept Offer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to accept this offer? This action cannot be undone.
                            The bid will be marked as completed and an order will be created.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowAcceptDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAcceptOffer}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Accepting...
                                </>
                            ) : (
                                'Accept Offer'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BidDetails;