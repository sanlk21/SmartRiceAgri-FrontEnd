import { useEffect, useState } from 'react';
import BidCard from '../../components/shared/BidCard';
import { bidService } from '../../services/bidService';

const BidHistory = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const data = await bidService.getBidHistory();
        setBids(data);
      } catch (error) {
        console.error('Error fetching bid history:', error);
      }
    };
    fetchBidHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Bid History</h2>
      <div className="grid gap-4">
        {bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
        {bids.length === 0 && <p className="text-center text-gray-500">No bid history found.</p>}
      </div>
    </div>
  );
};

export default BidHistory;
