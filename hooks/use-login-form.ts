'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types/user';

// Mock API call function - now returns User object on success
async function mockLoginApi(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (email === 'admin@email.com' && password === 'admin') {
    // Return mock User object for admin
    const mockAdminUser: User = {
      id: 'mock-admin-id',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    };
    return { success: true, user: mockAdminUser };
  } else {
    // Simulate a generic user login for demo purposes - now assigns AGENT role
    if (password === 'password') { // Example: any email with password 'password' is an AGENT
        const mockAgentUser: User = {
            id: `mock-agent-${Math.random().toString(36).substring(7)}`,
            email: email,
            role: UserRole.AGENT, // Assign AGENT role
        };
        return { success: true, user: mockAgentUser };
    }
    return { success: false, error: 'Invalid email or password' };
  }
}

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await mockLoginApi(email, password);
      if (result.success && result.user) {
        // TODO: Store user data (e.g., in context, state management library)
        console.log('Logged in user:', result.user);
        router.push('/dashboard');
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