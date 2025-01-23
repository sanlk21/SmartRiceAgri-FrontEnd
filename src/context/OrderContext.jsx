// src/context/OrderContext.jsx
import { createContext, useContext, useReducer } from 'react';
import { orderApi } from '../api/orderApi';

const OrderContext = createContext();

const initialState = {
  orders: [],
  adminOrders: [],
  loading: false,
  error: null,
  selectedOrder: null,
  statistics: null
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'FETCH_ORDERS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ORDERS_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: null };
    case 'FETCH_ORDERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_ADMIN_ORDERS_SUCCESS':
      return { ...state, loading: false, adminOrders: action.payload, error: null };
    case 'FETCH_STATISTICS_SUCCESS':
      return { ...state, statistics: action.payload };
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrder: action.payload };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        ),
        adminOrders: state.adminOrders.map(order =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        )
      };
    case 'CLEAR_ORDERS':
      return { ...state, orders: [], adminOrders: [], selectedOrder: null };
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  async function fetchOrders(userNic, role) {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const orders = role === 'FARMER' 
        ? await orderApi.getFarmerOrders(userNic)
        : await orderApi.getBuyerOrders(userNic);
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  }

  async function fetchAdminOrders() {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const [orders, stats] = await Promise.all([
        orderApi.getAllOrders(),
        orderApi.getOrderStatistics()
      ]);
      dispatch({ type: 'FETCH_ADMIN_ORDERS_SUCCESS', payload: orders });
      dispatch({ type: 'FETCH_STATISTICS_SUCCESS', payload: stats });
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
      dispatch({ 
        type: 'UPDATE_ORDER_STATUS', 
        payload: { id: orderId, status: newStatus }
      });
      return updatedOrder;
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
      throw error;
    }
  }

  function clearOrders() {
    dispatch({ type: 'CLEAR_ORDERS' });
  }

  const value = {
    state,
    dispatch,
    fetchOrders,
    fetchAdminOrders,
    updateOrderStatus,
    clearOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};