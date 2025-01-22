// src/components/shared/BidStatusBadge.jsx
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';
import React from 'react';

const BidStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status)
      )}
    >
      {status.toLowerCase()}
    </span>
  );
};

BidStatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default BidStatusBadge;