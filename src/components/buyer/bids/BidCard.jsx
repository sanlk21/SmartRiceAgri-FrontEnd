import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PropTypes from 'prop-types';

const BidCard = ({ bid, onBidClick }) => {
  const isExpiringSoon = new Date(bid.expiryDate) - new Date() < 24 * 60 * 60 * 1000; // 24 hours

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{bid.riceVariety}</h3>
            {isExpiringSoon && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">
                Expiring Soon
              </span>
            )}
          </div>
          <p>Quantity: {bid.quantity}kg</p>
          <p>Minimum Price: Rs.{bid.minimumPrice}/kg</p>
          <p>Location: {bid.location}</p>
          <p>Posted Date: {new Date(bid.postedDate).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={() => onBidClick(bid)}>
            Place Bid
          </Button>
          <Button variant="outline" onClick={() => window.open(`/bids/${bid.id}`, '_blank')}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

BidCard.propTypes = {
  bid: PropTypes.shape({
    id: PropTypes.string.isRequired,
    riceVariety: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    minimumPrice: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    postedDate: PropTypes.string.isRequired,
    expiryDate: PropTypes.string,
  }).isRequired,
  onBidClick: PropTypes.func.isRequired,
};

export default BidCard;
