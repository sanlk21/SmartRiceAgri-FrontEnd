import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { bidService } from '../../../services/bidService';

const PlaceBid = ({ bid, onClose }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bidService.placeBid(bid.id, parseFloat(amount));
      onClose();
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place the bid. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Place Bid</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Minimum Price: Rs.{bid.minimumPrice}/kg</p>
            <Input
              type="number"
              placeholder="Your bid amount per kg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
              min={bid.minimumPrice}
              step="0.01"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="w-full">
              Place Bid
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

PlaceBid.propTypes = {
  bid: PropTypes.shape({
    id: PropTypes.string.isRequired,
    minimumPrice: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlaceBid;
