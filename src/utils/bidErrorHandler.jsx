export class BidError extends Error {
    constructor(message, code, details = {}) {
      super(message);
      this.name = 'BidError';
      this.code = code;
      this.details = details;
    }
  }
  
  export const handleBidError = (error) => {
    if (error instanceof BidError) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
      };
    }
  
    // Handle API errors
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return {
            message: 'Invalid bid data',
            code: 'INVALID_BID_DATA',
            details: data.errors || {},
          };
        case 401:
          return {
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
            details: {},
          };
        case 403:
          return {
            message: 'You do not have permission to perform this action',
            code: 'FORBIDDEN',
            details: {},
          };
        case 404:
          return {
            message: 'Bid not found',
            code: 'BID_NOT_FOUND',
            details: {},
          };
        default:
          return {
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            details: {},
          };
      }
    }
  
    // Network errors
    if (!error.response && error.request) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        details: {},
      };
    }
  
    // Default error
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: {},
    };
  };
  