import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BidCard = ({ bid }) => {
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const navigate = useNavigate();

  const handlePlaceBid = async () => {
    try {
      // Implement bid placement logic here
      setShowBidDialog(false);
      navigate(`/buyer/bids/${bid.id}`);
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{bid.riceVariety} Rice</span>
          <span className="text-green-600">Rs. {bid.minimumPrice}/kg</span>
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
            <p className="font-medium">{bid.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Harvest Date</p>
            <p className="font-medium">{new Date(bid.harvestDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="font-medium">{bid.grade}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate(`/buyer/bids/${bid.id}`)}>
            View Details
          </Button>
          <Button onClick={() => setShowBidDialog(true)}>
            Place Bid
          </Button>
        </div>

        {showBidDialog && (
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
                  Minimum bid is Rs. {bid.minimumPrice}/kg
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBidDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePlaceBid}>
                  Place Bid
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default BidCard;