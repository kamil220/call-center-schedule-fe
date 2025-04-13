'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { authService, LoginCredentials } from '@/services/auth.service';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use auth service instead of direct mock function
      const credentials: LoginCredentials = { email, password };
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        login(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  };
} 