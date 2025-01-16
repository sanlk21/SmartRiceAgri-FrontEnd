import { paymentApi } from '@/api/paymentApi';
import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const PaymentContext = createContext(null);

const initialState = {
  payments: [],
  loading: false,
  error: null,
  currentPayment: null
};

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'SET_CURRENT_PAYMENT':
      return { ...state, currentPayment: action.payload };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ),
        currentPayment:
          state.currentPayment?.id === action.payload.id
            ? action.payload
            : state.currentPayment
      };
    default:
      return state;
  }
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const initializePayment = async (orderId, paymentMethod) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const payment = await paymentApi.initializePayment(orderId, paymentMethod);
      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: payment });
      return payment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processPayment = async (paymentId, paymentMethod, paymentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let updatedPayment;

      switch (paymentMethod) {
        case 'BANK_TRANSFER':
          updatedPayment = await paymentApi.processBankTransfer(
            paymentId,
            paymentData,
            paymentData.proofDocument
          );
          break;
        case 'CASH_ON_DELIVERY':
          updatedPayment = await paymentApi.processCashOnDelivery(
            paymentId,
            paymentData
          );
          break;
        case 'ONLINE_PAYMENT':
          updatedPayment = await paymentApi.processOnlinePayment(
            paymentId,
            paymentData
          );
          break;
        default:
          throw new Error('Invalid payment method');
      }

      dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });
      return updatedPayment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchPayments = async (userRole, userNic) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const payments = userRole === 'BUYER'
        ? await paymentApi.getBuyerPayments(userNic)
        : await paymentApi.getFarmerPayments(userNic);
      
      dispatch({ type: 'SET_PAYMENTS', payload: payments });
      return payments;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchPaymentDetails = async (paymentId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const payment = await paymentApi.getPayment(paymentId);
      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: payment });
      return payment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    initializePayment,
    processPayment,
    fetchPayments,
    fetchPaymentDetails
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;