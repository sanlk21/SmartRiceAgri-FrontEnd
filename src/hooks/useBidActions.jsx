import { useContext } from 'react';
import { BidContext } from '../contexts/BidContext';

export const useBidActions = () => {
  const { dispatch } = useContext(BidContext);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setBids: (bids) => dispatch({ type: 'SET_BIDS', payload: bids }),
    updateFilters: (filters) =>
      dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    addBid: (bid) => dispatch({ type: 'ADD_BID', payload: bid }),
    updateBid: (bid) => dispatch({ type: 'UPDATE_BID', payload: bid }),
  };

  return actions;
};
