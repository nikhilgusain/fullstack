import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const parseJWT = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        const decoded = parseJWT(savedToken);
        // Verify expiration
        if (decoded && decoded.exp > Date.now() / 1000) {
          setToken(savedToken);
          setUser({
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            avatar: decoded.avatar
          });
          console.log('[AuthContext] Valid token restored from localStorage.');
        } else {
          console.warn('[AuthContext] Token in localStorage was expired or invalid. Clearing.');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Direct post request using Axios instance
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, token: receivedToken } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(loggedInUser);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Failed to authenticate.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
    console.log('[AuthContext] User logged out, token cleared.');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
