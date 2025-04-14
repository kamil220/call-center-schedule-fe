'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/use-login-form';
import { Loader2 } from 'lucide-react';
import { useAuthActions } from '@/store/auth.store';
import { clearAuthCookies } from '@/lib/cookies';

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    isAuthenticated,
    handleSubmit,
  } = useLoginForm();

  const { syncWithCookies } = useAuthActions();
  const router = useRouter();

  // When component mounts, clear auth cookies to ensure clean login state
  // and sync with cookies in case a valid session exists
  useEffect(() => {
    clearAuthCookies();
    syncWithCookies();
  }, [syncWithCookies]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-full min-w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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