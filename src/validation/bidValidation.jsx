import { RICE_VARIETIES } from '../constants/bidConstants';

export const validateBidCreation = (bidData) => {
  const errors = {};

  // Quantity validation
  if (!bidData.quantity || bidData.quantity <= 0) {
    errors.quantity = 'Quantity must be greater than zero';
  } else if (bidData.quantity > 10000) {
    errors.quantity = 'Quantity cannot exceed 10,000kg';
  }

  // Minimum price validation
  if (!bidData.minimumPrice || bidData.minimumPrice <= 0) {
    errors.minimumPrice = 'Minimum price must be greater than zero';
  } else if (bidData.minimumPrice > 1000) {
    errors.minimumPrice = 'Minimum price cannot exceed Rs.1,000 per kg';
  }

  // Rice variety validation
  if (!bidData.riceVariety) {
    errors.riceVariety = 'Rice variety is required';
  } else if (!Object.values(RICE_VARIETIES).includes(bidData.riceVariety)) {
    errors.riceVariety = 'Invalid rice variety';
  }

  // Location validation
  if (!bidData.location || bidData.location.trim() === '') {
    errors.location = 'Location is required';
  } else if (bidData.location.length > 100) {
    errors.location = 'Location cannot exceed 100 characters';
  }

  // Description validation (optional)
  if (bidData.description && bidData.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateBidOffer = (offerData, currentBid) => {
  const errors = {};

  if (!offerData.bidAmount || offerData.bidAmount <= 0) {
    errors.bidAmount = 'Bid amount must be greater than zero';
  }

  if (currentBid) {
    if (offerData.bidAmount < currentBid.minimumPrice) {
      errors.bidAmount = `Bid amount must be at least ${currentBid.minimumPrice}`;
    }

    if (currentBid.status !== 'ACTIVE') {
      errors.general = 'This bid is no longer active';
    }

    const highestBid = Math.max(...currentBid.bidOffers.map((o) => o.bidAmount), 0);
    if (offerData.bidAmount <= highestBid) {
      errors.bidAmount = `Bid amount must be higher than the current highest bid (${highestBid})`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
