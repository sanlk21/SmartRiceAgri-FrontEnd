import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

// Initial state for orders
const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
};

// Action types
const actions = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ORDERS: 'SET_ORDERS',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
};

// Order context
const OrderContext = createContext(null);

// Reducer function
const orderReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_LOADING:
      return { ...state, loading: action.payload };
    case actions.SET_ERROR:
      return { ...state, error: action.payload };
    case actions.SET_ORDERS:
      return { ...state, orders: action.payload };
    case actions.SET_CURRENT_ORDER:
      return { ...state, currentOrder: action.payload };
    case actions.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id 
          ? action.payload 
          : state.currentOrder,
      };
    default:
      return state;
  }
};

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // API functions
  const createOrder = async (bidId, buyerNic, farmerNic, quantity, pricePerKg) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bidId,
          buyerNic,
          farmerNic,
          quantity,
          pricePerKg,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const order = await response.json();
      dispatch({ type: actions.SET_CURRENT_ORDER, payload: order });
      return order;
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const updatePayment = async (orderId, paymentDetails) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) throw new Error('Failed to update payment');
      
      const updatedOrder = await response.json();
      dispatch({ type: actions.UPDATE_ORDER, payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const fetchOrders = async (userRole, userNic) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/orders/${userRole.toLowerCase()}/${userNic}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const orders = await response.json();
      dispatch({ type: actions.SET_ORDERS, payload: orders });
      return orders;
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const value = {
    ...state,
    createOrder,
    updatePayment,
    fetchOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for using order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;