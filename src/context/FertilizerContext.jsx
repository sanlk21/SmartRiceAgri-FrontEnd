// src/context/FertilizerContext.js
import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const FertilizerContext = createContext();

const initialState = {
  allocations: [],
  currentAllocation: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    season: '',
    search: ''
  },
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ALLOCATIONS':
      return { ...state, allocations: action.payload };
    case 'SET_CURRENT_ALLOCATION':
      return { ...state, currentAllocation: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    default:
      return state;
  }
};

export const FertilizerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    ...state,
    dispatch,
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    setAllocations: (allocations) => dispatch({ type: 'SET_ALLOCATIONS', payload: allocations }),
    setCurrentAllocation: (allocation) => 
      dispatch({ type: 'SET_CURRENT_ALLOCATION', payload: allocation }),
    updateFilters: (filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters }),
    setPagination: (pagination) => dispatch({ type: 'SET_PAGINATION', payload: pagination })
  };

  return (
    <FertilizerContext.Provider value={value}>
      {children}
    </FertilizerContext.Provider>
  );
};

FertilizerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useFertilizer = () => {
  const context = useContext(FertilizerContext);
  if (!context) {
    throw new Error('useFertilizer must be used within a FertilizerProvider');
  }
  return context;
};