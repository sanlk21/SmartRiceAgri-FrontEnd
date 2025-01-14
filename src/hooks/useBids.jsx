import { useContext } from 'react';
import { BidContext } from '../contexts/BidContext';

export const useBids = () => {
  const context = useContext(BidContext);
  if (!context) {
    throw new Error('useBids must be used within a BidProvider');
  }
  return context.state;
};
