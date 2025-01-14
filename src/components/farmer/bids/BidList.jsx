import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';

const BidList = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await bidService.getFarmerBids();
        setBids(data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };
    fetchBids();
  }, []);

  const handleCancelBid = async (bidId) => {
    try {
      await bidService.cancelBid(bidId);
      setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      alert('Bid cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling bid:', error);
      alert('Failed to cancel the bid. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Bids</h2>
      <div className="grid gap-4">
        {bids.map((bid) => (
          <Card key={bid.id} className="p-4">
            <CardHeader>
              <CardTitle>{bid.riceVariety}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quantity: {bid.quantity}kg</p>
              <p>Minimum Price: Rs.{bid.minimumPrice}/kg</p>
              <p>Status: {bid.status}</p>
              {bid.status === 'ACTIVE' && (
                <Button                  variant="destructive"
                  onClick={() => handleCancelBid(bid.id)}
                  className="mt-4"
                >
                  Cancel Bid
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BidList;

