// src/components/orders/OrderStatusBadge.jsx
import React from 'react';

const statusColors = {
  PENDING: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const OrderStatusBadge = ({ status }) => {
  const colorClass = statusColors[status] || 'bg-gray-500';

  return (
    <span
      className={`inline-block px-3 py-1 text-white text-sm font-medium rounded ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
