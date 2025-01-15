import { websocketService } from '@/api/websocket/socket'; // Ensure correct path to websocketService
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBidAmount } from '@/utils/bidUtils';
import { format } from 'date-fns';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types'; // For prop validation
import { useEffect, useState } from 'react';

const BidMonitor = ({ bidId }) => {
  const [bidActivity, setBidActivity] = useState([]);
  const [bidStats, setBidStats] = useState({
    highestBid: 0,
    lowestBid: 0,
    averageBid: 0,
    totalBids: 0,
  });

  useEffect(() => {
    const handleBidUpdate = (data) => {
      if (data.bidId === bidId) {
        // Add new activity
        setBidActivity((prev) => [data, ...prev].slice(0, 10)); // Keep last 10 activities

        // Update statistics
        setBidStats((prev) => {
          const newHighest = Math.max(prev.highestBid, data.amount);
          const newLowest =
            prev.lowestBid === 0 ? data.amount : Math.min(prev.lowestBid, data.amount);
          const totalBids = prev.totalBids + 1;
          const newAverage = ((prev.averageBid * prev.totalBids) + data.amount) / totalBids;

          return {
            highestBid: newHighest,
            lowestBid: newLowest,
            averageBid: newAverage,
            totalBids: totalBids,
          };
        });
      }
    };

    // Subscribe to bid updates
    const unsubscribe = websocketService.subscribe('bidUpdates', handleBidUpdate);
    return () => unsubscribe(); // Cleanup on unmount
  }, [bidId]);

  const getBidTrend = (amount) => {
    if (bidActivity.length < 2) return null;
    const previousBid = bidActivity[1]?.amount || 0;
    return amount > previousBid ? 'up' : amount < previousBid ? 'down' : 'same';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-time Bid Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bid Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Highest Bid</p>
            <p className="text-lg font-semibold">{formatBidAmount(bidStats.highestBid)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Lowest Bid</p>
            <p className="text-lg font-semibold">{formatBidAmount(bidStats.lowestBid)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Average Bid</p>
            <p className="text-lg font-semibold">{formatBidAmount(bidStats.averageBid)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Bids</p>
            <p className="text-lg font-semibold">{bidStats.totalBids}</p>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Activity</h4>
          {bidActivity.map((activity, index) => {
            const trend = getBidTrend(activity.amount);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  <span className="font-medium">{formatBidAmount(activity.amount)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(activity.timestamp), 'HH:mm:ss')}
                </div>
              </div>
            );
          })}
          {bidActivity.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">No bid activity yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// PropTypes validation
BidMonitor.propTypes = {
  bidId: PropTypes.string.isRequired, // Ensure bidId is required and is a string
};

export default BidMonitor;
