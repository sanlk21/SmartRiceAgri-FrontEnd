// src/context/OrderContext.jsx
import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { orderApi } from '../api/orderApi';

// Create the context
export const OrderContext = createContext(null);

const initialState = {
  orders: [],
  loading: false,
  error: null,
  lastFetched: null,
  statistics: null
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ORDERS_START':
      return { 
        ...state, 
        loading: true, 
        error: null 
      };
    
    case 'FETCH_ORDERS_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        orders: action.payload,
        lastFetched: Date.now(),
        error: null 
      };
    
    case 'FETCH_ORDERS_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id 
            ? { ...order, status: action.payload.status }
            : order
        )
      };

    case 'SET_STATISTICS':
      return {
        ...state,
        statistics: action.payload
      };

    case 'CLEAR_ORDERS':
      return initialState;
    
    default:
      return state;
  }
};

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  
  const CACHE_TIMEOUT = 60000; // 1 minute cache

  const fetchOrders = useCallback(async (userNic, role) => {
    // Check if we have recently fetched data
    const shouldFetch = !state.lastFetched || 
                       Date.now() - state.lastFetched > CACHE_TIMEOUT;

    if (!shouldFetch) {
      return;
    }

    dispatch({ type: 'FETCH_ORDERS_START' });

    try {
      const response = role === 'FARMER' 
        ? await orderApi.getFarmerOrders(userNic)
        : await orderApi.getBuyerOrders(userNic);
      
      dispatch({ 
        type: 'FETCH_ORDERS_SUCCESS', 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ORDERS_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch orders' 
      });
    }
  }, [state.lastFetched]);

  const fetchAdminOrders = useCallback(async () => {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const [orders, statistics] = await Promise.all([
        orderApi.getAllOrders(),
        orderApi.getOrderStatistics()
      ]);

      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ORDERS_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch admin orders' 
      });
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { id: orderId, status: newStatus }
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ORDERS_ERROR',
        payload: error.response?.data?.message || 'Failed to update order status'
      });
      throw error;
    }
  }, []);

  // Memoize filtered orders
  const getFilteredOrders = useCallback((status) => {
    return state.orders.filter(order => order.status === status);
  }, [state.orders]);

  const value = useMemo(() => ({
    state,
    fetchOrders,
    fetchAdminOrders,
    updateOrderStatus,
    getFilteredOrders
  }), [state, fetchOrders, fetchAdminOrders, updateOrderStatus, getFilteredOrders]);

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