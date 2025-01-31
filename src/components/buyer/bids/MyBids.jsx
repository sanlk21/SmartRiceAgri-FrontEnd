import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { bidService } from '@/services/bidService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const MyBids = () => {
  const [winningBids, setWinningBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWinningBids = async () => {
      try {
        if (!user?.nic) {
          console.error('User NIC not found');
          return;
        }

        console.log('Fetching winning bids for buyer:', user.nic);
        const response = await bidService.getBuyerWinningBids(user.nic);
        console.log('Winning bids response:', response);
        setWinningBids(response);
      } catch (error) {
        console.error('Error fetching winning bids:', error);
        toast.error('Failed to fetch winning bids');
      } finally {
        setLoading(false);
      }
    };

    fetchWinningBids();
  }, [user?.nic]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.nic) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Please log in to view your bids</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Winning Bids</h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh
        </Button>
      </div>

      {winningBids.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No winning bids yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {winningBids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{bid.riceVariety}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    bid.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {bid.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-medium">{bid.quantity.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Your Winning Bid:</span>
                    <span className="font-medium text-green-600">
                      Rs. {bid.winningBidAmount?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount:</span>
                    <span className="font-medium">
                      Rs. {((bid.winningBidAmount || 0) * bid.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Farmer NIC:</span>
                    <span className="font-medium">{bid.farmerNic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{bid.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Harvest Date:</span>
                    <span className="font-medium">
                      {new Date(bid.harvestDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => window.open(`/bids/${bid.id}`, '_blank')}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;