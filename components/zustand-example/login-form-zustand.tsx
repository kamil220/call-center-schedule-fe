'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export function LoginFormZustand() {
  // Local form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Global auth state from Zustand
  const { isLoading, error, login, clearError } = useAuthStore(state => ({
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    clearError: state.clearError
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Call Zustand login action directly
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-full min-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">Login (Zustand)</CardTitle>
            <CardDescription>
              Enter your email below to login to your account. (admin@email.com / admin)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError(); // Clear error on input change
                }}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError(); // Clear error on input change
                }}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 