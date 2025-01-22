import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { bidService } from '@/services/bidService';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BidCard = ({ bid }) => {
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePlaceBid = async () => {
    if (!user?.nic) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to place a bid"
      });
      return;
    }

    try {
      setLoading(true);
      await bidService.placeBid({
        bidId: bid.id,
        buyerNic: user.nic,
        bidAmount: parseFloat(bidAmount)
      });
      
      toast({
        title: "Success",
        description: "Bid placed successfully"
      });
      
      setShowBidDialog(false);
      navigate(`/buyer/bids/${bid.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to place bid"
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidBid = bidAmount && parseFloat(bidAmount) >= bid.minimumPrice;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{bid.riceVariety} Rice</span>
          <span className="text-green-600">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'LKR'
            }).format(bid.minimumPrice)}/kg
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Quantity Available</p>
            <p className="font-medium">{bid.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{bid.location || 'Not specified'}</p>
          </div>
          {bid.harvestDate && (
            <div>
              <p className="text-sm text-gray-500">Harvest Date</p>
              <p className="font-medium">{formatDate(bid.harvestDate)}</p>
            </div>
          )}
          {bid.grade && (
            <div>
              <p className="text-sm text-gray-500">Grade</p>
              <p className="font-medium">{bid.grade}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate(`/buyer/bids/${bid.id}`)}>
            View Details
          </Button>
          <Button onClick={() => setShowBidDialog(true)}>
            Place Bid
          </Button>
        </div>

        <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Bid</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={bid.minimumPrice}
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimum bid is {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'LKR'
                }).format(bid.minimumPrice)}/kg
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowBidDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePlaceBid} 
                disabled={!isValidBid || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Bid...
                  </>
                ) : (
                  'Place Bid'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BidCard;