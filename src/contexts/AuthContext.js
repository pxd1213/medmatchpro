import React, { createContext, useContext, useState, useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

// Initialize Netlify Identity
netlifyIdentity.init();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user
    const existingUser = netlifyIdentity.currentUser();
    setUser(existingUser);
    setIsLoading(false);

    // Listen for authentication events
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      window.location.pathname = '/';
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
      window.location.pathname = '/login';
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => netlifyIdentity.open();
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
