'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { authReducer, initialState } from '@/reducers/authReducer'; // Import reducer
import { AuthState } from '@/types/auth.types'; // Import type

// Define the key for session storage
const USER_SESSION_KEY = 'telemedi_user_session';

// Context Type (Exposed Values)
interface AuthContextType extends Omit<AuthState, 'isLoading'> { // Exclude isLoading from top-level context type if only used internally
  isLoading: boolean; // Keep isLoading for conditional rendering in layout or components
  login: (userData: User) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Refactored AuthProvider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize state from sessionStorage on mount
  useEffect(() => {
    let initialUser: User | null = null;
    try {
      const storedUser = sessionStorage.getItem(USER_SESSION_KEY);
      if (storedUser) {
        initialUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user session data:", error);
      sessionStorage.removeItem(USER_SESSION_KEY);
    }
    dispatch({ type: 'INITIALIZE', payload: { user: initialUser } });
  }, []);

  // Login function handles side effects and dispatches action
  const login = (userData: User) => {
    try {
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
      dispatch({ type: 'LOGIN', payload: userData });
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to save user session data:", error);
      // Handle potential storage errors
    }
  };

  // Logout function handles side effects and dispatches action
  const logout = () => {
    sessionStorage.removeItem(USER_SESSION_KEY);
    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  // Prevent rendering children until loading (initialization) is finished
  if (state.isLoading) {
    return null; // Or a global loading indicator
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 