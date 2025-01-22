// src/components/buyer/bids/BidCard.jsx
import BidStatusBadge from '@/components/shared/BidStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropTypes from 'prop-types';
import React from 'react';

const BidCard = ({ bid }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{bid.riceVariety} Rice</CardTitle>
          <BidStatusBadge status={bid.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-medium">{bid.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price per kg</p>
            <p className="font-medium">Rs. {bid.pricePerKg}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{bid.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Posted Date</p>
            <p className="font-medium">
              {new Date(bid.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Place Bid</Button>
        </div>
      </CardContent>
    </Card>
  );
};

BidCard.propTypes = {
  bid: PropTypes.shape({
    id: PropTypes.string.isRequired,
    riceVariety: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    pricePerKg: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired
};

export default BidCard;