import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useState } from 'react';
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

export const AuthProvider = ({ children = null }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      clearError();
      
      const userData = await authApi.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Navigate based on user role
      switch (userData.role) {
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
      
      return userData;
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      clearError();
      
      const newUser = await authApi.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Navigate based on user role
      switch (newUser.role) {
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        case 'BUYER':
          navigate('/buyer/dashboard');
          break;
        default:
          navigate('/');
      }
      
      return newUser;
    } catch (error) {
      setError(error.message);
      setIsAuthenticated(false);
      throw error;
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
      setError(error.message);
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
      setError(error.message);
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

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;