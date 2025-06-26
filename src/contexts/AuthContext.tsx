import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@netlify/identity-widget';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Netlify Identity
    window.netlifyIdentity?.init();
    
    // Check for existing user
    const existingUser = window.netlifyIdentity?.getCurrentUser();
    setUser(existingUser);
    setIsLoading(false);

    // Listen for auth changes
    window.netlifyIdentity?.on('login', (user) => {
      setUser(user);
    });

    window.netlifyIdentity?.on('logout', () => {
      setUser(null);
    });
  }, []);

  const login = () => {
    window.netlifyIdentity?.open();
  };

  const logout = () => {
    window.netlifyIdentity?.close();
    window.netlifyIdentity?.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
