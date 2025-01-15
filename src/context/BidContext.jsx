// src/contexts/BidContext.jsx
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import websocketService from '../services/websocketService';

const BidContext = createContext();

const initialState = {
  bids: [],
  activeBid: null,
  loading: false,
  error: null,
  filters: {
    riceVariety: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'date',
    sortDirection: 'desc',
  },
};

const bidReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BIDS':
      return { ...state, bids: action.payload, loading: false };
    case 'UPDATE_BID': {
      const updatedBids = state.bids.map(bid =>
        bid.id === action.payload.id ? action.payload : bid
      );
      return { 
        ...state, 
        bids: updatedBids,
        activeBid: state.activeBid?.id === action.payload.id ? action.payload : state.activeBid
      };
    }
    case 'ADD_BID':
      return { ...state, bids: [action.payload, ...state.bids] };
    case 'SET_ACTIVE_BID':
      return { ...state, activeBid: action.payload };
    case 'REMOVE_BID':
      return {
        ...state,
        bids: state.bids.filter(bid => bid.id !== action.payload),
        activeBid: state.activeBid?.id === action.payload ? null : state.activeBid
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
};

export const BidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bidReducer, initialState);

  // Subscribe to WebSocket updates
  useEffect(() => {
    const handleBidUpdate = (data) => {
      dispatch({ type: 'UPDATE_BID', payload: data });
    };

    const handleNewBid = (data) => {
      dispatch({ type: 'ADD_BID', payload: data });
    };

    const handleBidExpired = (bidId) => {
      dispatch({ type: 'REMOVE_BID', payload: bidId });
    };

    // Subscribe to WebSocket events
    const unsubscribeBidUpdate = websocketService.subscribe('bidUpdates', handleBidUpdate);
    const unsubscribeNewBid = websocketService.subscribe('newBids', handleNewBid);
    const unsubscribeBidExpired = websocketService.subscribe('bidExpired', handleBidExpired);

    return () => {
      unsubscribeBidUpdate();
      unsubscribeNewBid();
      unsubscribeBidExpired();
    };
  }, []);

  const value = {
    state,
    dispatch
  };

  return (
    <BidContext.Provider value={value}>
      {children}
    </BidContext.Provider>
  );
};

BidProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { BidContext };
