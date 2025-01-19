import { orderApi } from '@/api/orderApi';
import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
};

const actions = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ORDERS: 'SET_ORDERS',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
};

const OrderContext = createContext(null);

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

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const fetchOrders = async (role, userNic) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      let orders;
      if (role === 'BUYER') {
        orders = await orderApi.getBuyerOrders(userNic);
      } else if (role === 'FARMER') {
        orders = await orderApi.getFarmerOrders(userNic);
      } else if (role === 'ADMIN') {
        orders = await orderApi.getAllOrders();
      }
      dispatch({ type: actions.SET_ORDERS, payload: orders });
      return orders;
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const getOrderDetails = async (orderId) => {
    dispatch({ type: actions.SET_LOADING, payload: true });
    try {
      const order = await orderApi.getOrderDetails(orderId);
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
      const updatedOrder = await orderApi.updatePayment(orderId, paymentDetails);
      dispatch({ type: actions.UPDATE_ORDER, payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      dispatch({ type: actions.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  };

  const value = {
    ...state,
    fetchOrders,
    getOrderDetails,
    updatePayment,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
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

export default OrderContext;