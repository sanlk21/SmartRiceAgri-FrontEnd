import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';

const MyBids = () => {
  const [winningBids, setWinningBids] = useState([]);

  useEffect(() => {
    const fetchWinningBids = async () => {
      try {
        const data = await bidService.getBuyerWinningBids();
        setWinningBids(data);
      } catch (error) {
        console.error('Error fetching winning bids:', error);
      }
    };
    fetchWinningBids();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Winning Bids</h2>
      <div className="grid gap-4">
        {winningBids.map((bid) => (
          <Card key={bid.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{bid.riceVariety}</h3>
                <p>Quantity: {bid.quantity}kg</p>
                <p>Winning Bid: Rs.{bid.winningBidAmount}/kg</p>
                <p>Total Amount: Rs.{bid.winningBidAmount * bid.quantity}</p>
                <p>Status: {bid.status}</p>
                <p>Farmer Location: {bid.location}</p>
              </div>
              <Button
                onClick={() => window.open(`/bids/${bid.id}`, '_blank')}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
        {winningBids.length === 0 && (
          <p className="text-center text-gray-500">No winning bids yet</p>
        )}
      </div>
    </div>
  );
};

export default MyBids;
