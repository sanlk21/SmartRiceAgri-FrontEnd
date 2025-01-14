import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';

const BidDetails = ({ bidId }) => {
  const [bid, setBid] = useState(null);

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const data = await bidService.getBidDetails(bidId);
        setBid(data);
      } catch (error) {
        console.error('Error fetching bid details:', error);
      }
    };
    fetchBidDetails();
  }, [bidId]);

  if (!bid) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bid Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              <p>Rs.{bid.minimumPrice}/kg</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{bid.status}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Bid Offers</h3>
            <div className="space-y-2">
              {bid.bidOffers.map((offer, index) => (
                <div key={index} className="p-2 border rounded">
                  <p>Amount: Rs.{offer.bidAmount}/kg</p>
                  <p>Date: {new Date(offer.bidDate).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

BidDetails.propTypes = {
  bidId: PropTypes.string.isRequired,
};

export default BidDetails;
