import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

// Create context with initial shape
const FertilizerContext = createContext({
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
  },
  dispatch: () => null,
  setLoading: () => null,
  setError: () => null,
  setAllocations: () => null,
  setCurrentAllocation: () => null,
  updateFilters: () => null,
  setPagination: () => null
});

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

// Action types as constants to prevent typos
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ALLOCATIONS: 'SET_ALLOCATIONS',
  SET_CURRENT_ALLOCATION: 'SET_CURRENT_ALLOCATION',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_ALLOCATIONS:
      return { ...state, allocations: action.payload };
    case ActionTypes.SET_CURRENT_ALLOCATION:
      return { ...state, currentAllocation: action.payload };
    case ActionTypes.UPDATE_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ActionTypes.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    default:
      return state;
  }
};

export const FertilizerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = {
    ...state,
    dispatch,
    setLoading: (loading) => 
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => 
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setAllocations: (allocations) => 
      dispatch({ type: ActionTypes.SET_ALLOCATIONS, payload: allocations }),
    setCurrentAllocation: (allocation) => 
      dispatch({ type: ActionTypes.SET_CURRENT_ALLOCATION, payload: allocation }),
    updateFilters: (filters) => 
      dispatch({ type: ActionTypes.UPDATE_FILTERS, payload: filters }),
    setPagination: (pagination) => 
      dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination })
  };

  return (
    <FertilizerContext.Provider value={contextValue}>
      {children}
    </FertilizerContext.Provider>
  );
};

// Define prop types for the provider
FertilizerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook with proper error handling
export const useFertilizer = () => {
  const context = useContext(FertilizerContext);
  
  if (context === undefined) {
    throw new Error('useFertilizer must be used within a FertilizerProvider');
  }
  
  return context;
};

// Export the context for any components that need direct access
export default FertilizerContext;