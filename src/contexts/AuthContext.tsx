
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call - replace with actual authentication
      if (email === 'admin@airesume.com' && password === 'admin123') {
        const adminUser = { 
          id: 'admin-1', 
          email, 
          name: 'Admin User', 
          isAdmin: true 
        };
        const token = 'mock-admin-token';
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(adminUser));
        setUser(adminUser);
      } else if (email && password) {
        const normalUser = { 
          id: 'user-1', 
          email, 
          name: email.split('@')[0] 
        };
        const token = 'mock-user-token';
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(normalUser));
        setUser(normalUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call - replace with actual registration
      const newUser = { 
        id: `user-${Date.now()}`, 
        email, 
        name 
      };
      const token = 'mock-token';
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
