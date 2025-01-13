import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  // Setup axios interceptor for token
  useEffect(() => {
    const interceptor = authApi.setupInterceptors(logout);

    return () => {
      if (interceptor !== undefined) {
        authApi.removeInterceptor(interceptor);
      }
    };
  }, [logout]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.verifyToken();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleAuthError = useCallback((error) => {
    const message = error.response?.data?.message || 'An error occurred';
    setError(message);
    setUser(null);
    setIsAuthenticated(false);
    throw error;
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      clearError();
      
      const { token, user } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Navigate based on user role
      switch (user.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'BUYER':
          navigate('/buyer/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
      
      return user;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      clearError();
      
      const { token, user } = await authApi.register(userData);
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Navigate based on user role
      switch (user.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'BUYER':
          navigate('/buyer/dashboard');
          break;
        default:
          navigate('/');
      }
      
      return user;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      clearError();
      await authApi.resetPassword(email);
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      clearError();
      
      const updatedUser = await authApi.updateProfile(profileData);
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};