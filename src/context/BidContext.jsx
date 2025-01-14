import PropTypes from 'prop-types';
import { createContext, useReducer } from 'react';

const BidContext = createContext();

const initialState = {
  bids: [],
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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_BID':
      return { ...state, bids: [...state.bids, action.payload] };
    case 'UPDATE_BID':
      return {
        ...state,
        bids: state.bids.map((bid) =>
          bid.id === action.payload.id ? action.payload : bid
        ),
      };
    default:
      return state;
  }
};

export const BidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bidReducer, initialState);

  return (
    <BidContext.Provider value={{ state, dispatch }}>
      {children}
    </BidContext.Provider>
  );
};

// Adding PropTypes validation for children
BidProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { BidContext };
