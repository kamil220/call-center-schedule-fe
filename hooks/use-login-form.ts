'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsLoading(true); // Handled by store
    // setError(null); // Handled by store (implicitly via login action)

    // Call the login action from the Zustand store
    await login(email, password); 

    // The try...catch and result handling logic is now inside the store's login action
    /* 
    try {
      // Use auth service instead of direct mock function
      const credentials: LoginCredentials = { email, password };
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        login(result.user); // This was the old context login
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
    */
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading, // Return state from store
    error, // Return state from store
    isAuthenticated, // Return isAuthenticated state from store
    handleSubmit,
  };
} 