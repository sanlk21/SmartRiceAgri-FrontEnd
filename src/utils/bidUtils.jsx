import { formatDistance, isAfter } from 'date-fns'; // Removed unused `format`

export const formatBidAmount = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
  }).format(amount);
};

export const calculateBidStatistics = (bids) => {
  if (!bids.length) return null;

  const stats = {
    totalBids: bids.length,
    totalValue: 0,
    averagePrice: 0,
    highestBid: 0,
    lowestBid: Infinity,
    activeBids: 0,
    completedBids: 0,
  };

  bids.forEach((bid) => {
    const bidValue = bid.quantity * bid.minimumPrice;
    stats.totalValue += bidValue;
    stats.highestBid = Math.max(stats.highestBid, bid.minimumPrice);
    stats.lowestBid = Math.min(stats.lowestBid, bid.minimumPrice);

    if (bid.status === 'ACTIVE') stats.activeBids++;
    if (bid.status === 'COMPLETED') stats.completedBids++;
  });

  stats.averagePrice = stats.totalValue / stats.totalBids;
  return stats;
};

export const getBidTimeLeft = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);

  if (isAfter(now, expiry)) {
    return 'Expired';
  }

  return formatDistance(expiry, now, { addSuffix: true });
};

export const validateBidAmount = (amount, minimumPrice) => {
  const errors = [];

  if (!amount || amount <= 0) {
    errors.push('Bid amount must be greater than zero');
  }

  if (amount < minimumPrice) {
    errors.push(`Bid amount must be at least ${formatBidAmount(minimumPrice)}`);
  }

  return errors;
};
