import { websocketService } from '@/api/websocket/socket'; // Import websocketService
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import { AlertTriangle, Clock, Eye, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const BidCard = ({ bid, onBidClick, onViewDetails }) => {
  const [currentBid, setCurrentBid] = useState(bid);
  const [timeLeft, setTimeLeft] = useState('');
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    setCurrentBid(bid);
  }, [bid]);

  useEffect(() => {
    // Update time left
    const updateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(currentBid.expiryDate);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentBid.expiryDate]);

  // Subscribe to real-time bid updates
  useEffect(() => {
    const handleBidUpdate = (data) => {
      if (data.bidId === currentBid.id) {
        setCurrentBid((prev) => ({
          ...prev,
          currentPrice: data.newPrice,
          totalBids: data.totalBids,
          lastBidTime: data.timestamp,
        }));
        
        setBidHistory((prev) => [data, ...prev].slice(0, 5)); // Keep last 5 bids
      }
    };

    const unsubscribe = websocketService.subscribe('bidUpdates', handleBidUpdate);
    return () => unsubscribe();
  }, [currentBid.id]);

  const handleBidClick = () => {
    if (onBidClick) {
      onBidClick(currentBid);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(currentBid);
    }
  };

  const isExpiringSoon =
    timeLeft &&
    timeLeft !== 'Expired' &&
    new Date(currentBid.expiryDate) - new Date() < 1000 * 60 * 60; // Less than 1 hour

  const getBidStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 relative hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        {/* Left side - Bid Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{currentBid.riceVariety}</h3>
            <Badge variant="secondary" className={getBidStatusColor(currentBid.status)}>
              {currentBid.status}
            </Badge>
            {isExpiringSoon && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Expiring Soon
              </Badge>
            )}
          </div>

          {/* Bid Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium">{currentBid.quantity} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Price</p>
              <p className="font-medium">{formatBidAmount(currentBid.currentPrice)}/kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{currentBid.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Left</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                {timeLeft}
              </p>
            </div>
          </div>

          {/* Bid Activity */}
          {bidHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Recent Activity</p>
              <div className="space-y-1">
                {bidHistory.map((bid, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>Bid placed: {formatBidAmount(bid.amount)}</span>
                    <span className="text-gray-400">
                      {format(new Date(bid.timestamp), 'HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBidClick}
            disabled={currentBid.status !== 'ACTIVE'}
            className="w-full"
          >
            Place Bid
          </Button>
          <Button variant="outline" onClick={handleViewDetails} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Warning for minimum bid */}
      {currentBid.minimumBidIncrement && (
        <Tooltip content={`Minimum bid increment: ${formatBidAmount(currentBid.minimumBidIncrement)}`}>
          <div className="mt-4 text-sm text-amber-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Minimum bid increment applies</span>
          </div>
        </Tooltip>
      )}
    </Card>
  );
};

BidCard.propTypes = {
  bid: PropTypes.shape({
    id: PropTypes.string.isRequired,
    riceVariety: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    currentPrice: PropTypes.number.isRequired,
    minimumPrice: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    totalBids: PropTypes.number,
    minimumBidIncrement: PropTypes.number,
    amount: PropTypes.number, // Added
    timestamp: PropTypes.string, // Added
  }).isRequired,
  onBidClick: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default BidCard;
