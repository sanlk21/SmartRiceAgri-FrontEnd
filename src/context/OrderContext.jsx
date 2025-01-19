import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const OrderContext = createContext();

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrders = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch orders logic here
      const orders = []; // Replace with real API call
      dispatch({ type: 'SET_ORDERS', payload: orders });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <OrderContext.Provider value={{ ...state, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
