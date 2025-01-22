import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { bidService } from '@/services/bidService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BidList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBids = async () => {
    if (!user?.nic) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User NIC not found. Please log in again.'
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await bidService.getFarmerBids(user.nic);
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to fetch bids'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [user?.nic]);

  const handleCancelBid = async (bidId) => {
    try {
      await bidService.cancelBid(user.nic);
      await fetchBids(); // Refresh the list after cancellation
      toast({
        title: 'Success',
        description: 'Bid cancelled successfully!'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to cancel the bid'
      });
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bids.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bids found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Bids</h2>
        <Button onClick={fetchBids} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {bids.map((bid) => (
          <Card key={bid.id}>
            <CardHeader>
              <CardTitle>{bid.riceVariety}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Quantity: {bid.quantity}kg</p>
                <p>Minimum Price: {formatPrice(bid.minimumPrice)}/kg</p>
                <p>Status: {bid.status}</p>
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={() => navigate(`/farmer/bids/${bid.id}`)}
                    variant="outline"
                  >
                    View Details
                  </Button>
                  {bid.status === 'ACTIVE' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBid(bid.id)}
                    >
                      Cancel Bid
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BidList;