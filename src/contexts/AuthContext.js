import React, { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((username, password) => {
    setIsAuthenticated(true);
    setAuth({ username, password });
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setAuth({ username: '', password: '' });
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }, []);


  return (
    <AuthContext.Provider value={{ auth,isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext)
};
