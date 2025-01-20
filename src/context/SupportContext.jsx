// src/context/SupportContext.js
import { createContext, useContext } from 'react';
import { useSupport } from '../hooks/useSupport';

const SupportContext = createContext(null);

export const SupportProvider = ({ children }) => {
  const supportMethods = useSupport();
  
  return (
    <SupportContext.Provider value={supportMethods}>
      {children}
    </SupportContext.Provider>
  );
};

export const useGlobalSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useGlobalSupport must be used within a SupportProvider');
  }
  return context;
};

// Example usage in components:
/*
import { useGlobalSupport } from '@/context/SupportContext';

const YourComponent = () => {
  const { tickets, loading, error, createTicket } = useGlobalSupport();
  
  // Use the support methods here
};
*/