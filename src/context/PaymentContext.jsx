import { paymentService } from '@/services/paymentService';
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
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const initializePayment = async (orderId, paymentMethod) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const payment = await paymentService.initializePayment(orderId, paymentMethod);
      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: payment });
      return payment;
    } catch (error) {
      const errorMessage = error.name === 'PaymentError' 
        ? error.message 
        : 'Failed to initialize payment. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processPayment = async (paymentId, paymentMethod, paymentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      let updatedPayment;

      switch (paymentMethod) {
        case 'BANK_TRANSFER':
          updatedPayment = await paymentService.processBankTransfer(
            paymentId,
            paymentData,
            paymentData.proofFile
          );
          break;

        case 'CASH_ON_DELIVERY':
          updatedPayment = await paymentService.processCashOnDelivery(
            paymentId,
            paymentData
          );
          break;

        case 'ONLINE_PAYMENT':
          updatedPayment = await paymentService.processOnlinePayment(
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
      const errorMessage = error.name === 'PaymentError'
        ? error.message
        : 'Failed to process payment. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchPayments = async (userRole, userNic, filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const payments = userRole === 'BUYER'
        ? await paymentService.getBuyerPayments(userNic, filters)
        : await paymentService.getFarmerPayments(userNic, filters);
      
      dispatch({ type: 'SET_PAYMENTS', payload: payments });
      return payments;
    } catch (error) {
      const errorMessage = error.name === 'PaymentError'
        ? error.message
        : 'Failed to fetch payments. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchPaymentDetails = async (paymentId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const payment = await paymentService.getPayment(paymentId);
      dispatch({ type: 'SET_CURRENT_PAYMENT', payload: payment });
      return payment;
    } catch (error) {
      const errorMessage = error.name === 'PaymentError'
        ? error.message
        : 'Failed to fetch payment details. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const downloadPaymentProof = async (paymentId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      return await paymentService.downloadPaymentProof(paymentId);
    } catch (error) {
      const errorMessage = error.name === 'PaymentError'
        ? error.message
        : 'Failed to download payment proof. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getPaymentStatistics = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      return await paymentService.getPaymentStatistics();
    } catch (error) {
      const errorMessage = error.name === 'PaymentError'
        ? error.message
        : 'Failed to fetch payment statistics. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
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
    fetchPaymentDetails,
    downloadPaymentProof,
    getPaymentStatistics
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