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
      console.log('Fetching bids for farmer NIC:', user.nic); // Debug log
      const data = await bidService.getFarmerBids(user.nic);
      console.log('Fetched bids:', data); // Debug log
      setBids(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to fetch bids'
      });
      setBids([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.nic) {
      fetchBids();
    }
  }, [user?.nic]);

  const handleCancelBid = async (bidId) => {
    if (!bidId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid bid ID'
      });
      return;
    }

    try {
      await bidService.cancelBid(bidId); // Fixed: passing bidId instead of user.nic
      await fetchBids();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Bids</h2>
        <Button onClick={fetchBids} variant="outline">
          Refresh
        </Button>
      </div>

      {!bids.length ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bids found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <CardTitle>{bid.riceVariety}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Bid ID: {bid.id}</p>
                  <p>Farmer NIC: {bid.farmerNic}</p>
                  <p>Quantity: {bid.quantity}kg</p>
                  <p>Minimum Price: {formatPrice(bid.minimumPrice)}/kg</p>
                  <p>Status: <span className={`px-2 py-1 rounded ${
                    bid.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    bid.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{bid.status}</span></p>
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
      )}
    </div>
  );
};

export default BidList;