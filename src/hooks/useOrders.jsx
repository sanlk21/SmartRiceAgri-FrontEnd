// src/hooks/useOrders.js
import { orderApi } from '@/api/orderApi';
import { OrderContext } from '@/context/OrderContext';
import { useCallback, useContext } from 'react';

export function useOrders() {
  const { state, dispatch } = useContext(OrderContext);

  const fetchOrders = useCallback(async (userNic, role) => {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const orders = role === 'FARMER' 
        ? await orderApi.getFarmerOrders(userNic)
        : await orderApi.getBuyerOrders(userNic);
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  const updatePayment = useCallback(async (orderId, paymentData) => {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      const updatedOrder = await orderApi.updatePayment(orderId, paymentData);
      await fetchOrders(state.userNic, state.userRole); // Refresh orders
      return updatedOrder;
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch, fetchOrders, state.userNic, state.userRole]);

  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const order = await orderApi.getOrderDetails(orderId);
      dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
      return order;
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  return {
    // State
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    selectedOrder: state.selectedOrder,
    
    // Actions
    fetchOrders,
    updatePayment,
    getOrderDetails,
    
    // Admin actions
    fetchAdminOrders: state.fetchAdminOrders,
    updateOrderStatus: state.updateOrderStatus,
    statistics: state.statistics
  };
}