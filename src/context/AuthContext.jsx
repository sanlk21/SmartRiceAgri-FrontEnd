// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

// Create the AuthContext
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify the token
          const userData = await authApi.verifyToken();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login method
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const { token, user } = await authApi.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      // Clear any existing authentication
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const { token, user } = await authApi.register(userData);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      // Clear any existing authentication
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};