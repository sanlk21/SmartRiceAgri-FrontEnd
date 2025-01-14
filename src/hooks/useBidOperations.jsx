import { bidService } from '../services/bidService';
import { useBidActions } from './useBidActions';

export const useBidOperations = () => {
  const actions = useBidActions();

  const fetchBids = async (filters) => {
    actions.setLoading(true);
    try {
      const data = await bidService.getAvailableBids(filters);
      actions.setBids(data);
    } catch (error) {
      actions.setError(error.message);
    }
  };

  const createBid = async (bidData) => {
    actions.setLoading(true);
    try {
      const newBid = await bidService.createBid(bidData);
      actions.addBid(newBid);
      return newBid;
    } catch (error) {
      actions.setError(error.message);
      throw error;
    }
  };

  const placeBid = async (bidId, amount) => {
    actions.setLoading(true);
    try {
      const updatedBid = await bidService.placeBid(bidId, amount);
      actions.updateBid(updatedBid);
      return updatedBid;
    } catch (error) {
      actions.setError(error.message);
      throw error;
    }
  };

  const cancelBid = async (bidId) => {
    actions.setLoading(true);
    try {
      const updatedBid = await bidService.cancelBid(bidId);
      actions.updateBid(updatedBid);
      return updatedBid;
    } catch (error) {
      actions.setError(error.message);
      throw error;
    }
  };

  return {
    fetchBids,
    createBid,
    placeBid,
    cancelBid,
  };
};
