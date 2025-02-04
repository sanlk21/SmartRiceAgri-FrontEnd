// src/hooks/useOrders.js
import { orderApi } from '@/api/orderApi';
import { useAuth } from '@/context/AuthContext';
import { OrderContext } from '@/context/OrderContext';
import { useCallback, useContext, useEffect, useState } from 'react';

export function useOrders() {
  const { state, dispatch } = useContext(OrderContext);
  const { user } = useAuth();
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const CACHE_DURATION = 60000; // 1 minute cache

  const shouldRefetch = useCallback(() => {
    if (!lastFetchTime) return true;
    return Date.now() - lastFetchTime > CACHE_DURATION;
  }, [lastFetchTime]);

  const handleError = useCallback((error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    dispatch({ type: 'FETCH_ORDERS_ERROR', payload: errorMessage });
    throw error;
  }, [dispatch]);

  const fetchOrders = useCallback(async (userNic, role) => {
    if (!shouldRefetch()) {
      return;
    }

    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      let orders;
      if (role === 'FARMER') {
        orders = await orderApi.getFarmerOrders(userNic);
      } else if (role === 'BUYER') {
        orders = await orderApi.getBuyerOrders(userNic);
      } else {
        throw new Error('Invalid user role');
      }
      
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
      dispatch({ 
        type: 'SET_USER_CONTEXT', 
        payload: { nic: userNic, role } 
      });
      setLastFetchTime(Date.now());
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, handleError, shouldRefetch]);

  const fetchAdminOrders = useCallback(async () => {
    if (!shouldRefetch()) {
      return;
    }

    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const [orders, statistics] = await Promise.all([
        orderApi.getAllOrders(),
        orderApi.getOrderStatistics()
      ]);

      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
      setLastFetchTime(Date.now());
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, handleError, shouldRefetch]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { id: orderId, status: newStatus }
      });
      
      // Refresh orders after status update
      if (user?.role === 'ADMIN') {
        await fetchAdminOrders();
      }
      
      return updatedOrder;
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, handleError, user?.role, fetchAdminOrders]);

  const updatePayment = useCallback(async (orderId, paymentData) => {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const updatedOrder = await orderApi.updatePayment(orderId, paymentData);
      
      // Refresh orders after payment update
      if (user?.role === 'ADMIN') {
        await fetchAdminOrders();
      } else if (user?.nic && user?.role) {
        await fetchOrders(user.nic, user.role);
      }
      
      return updatedOrder;
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, user, fetchOrders, fetchAdminOrders, handleError]);

  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const order = await orderApi.getOrderDetails(orderId);
      dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
      return order;
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, handleError]);

  const getFilteredOrders = useCallback((status) => {
    return state.orders.filter(order => order.status === status) || [];
  }, [state.orders]);

  // Auto-refresh orders on mount and role change
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      if (user.role === 'ADMIN') {
        await fetchAdminOrders();
      } else if (user.nic && (user.role === 'FARMER' || user.role === 'BUYER')) {
        await fetchOrders(user.nic, user.role);
      }
    };

    loadOrders();
  }, [user, fetchOrders, fetchAdminOrders]);

  return {
    // State
    orders: state.orders || [],
    loading: state.loading,
    error: state.error,
    selectedOrder: state.selectedOrder,
    statistics: state.statistics,
    
    // Actions
    fetchOrders,
    updatePayment,
    getOrderDetails,
    getFilteredOrders,
    
    // Admin actions
    fetchAdminOrders,
    updateOrderStatus
  };
}