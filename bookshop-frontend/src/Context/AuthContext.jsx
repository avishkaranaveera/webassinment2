import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../service/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Check for token on initial load
  useEffect(() => {
    const token = authService.getCurrentUserToken();
    setIsUserLoggedIn(!!token);
  }, []);

  const login = () => {
    setIsUserLoggedIn(true);
  };

  const logout = () => {
    authService.logout();
    setIsUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isUserLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};