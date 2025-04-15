'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/use-login-form';
import { Loader2, ChevronRight } from 'lucide-react';
import { useUser, useAuthStore } from '@/store/auth.store';
import { clearAuthCookies } from '@/lib/cookies';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// User role credentials
const roleCredentials = [
  {
    role: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    description: 'Full access to all system features and settings.'
  },
  {
    role: 'Planner',
    email: 'planner@example.com',
    password: 'planner123',
    description: 'Access to scheduling and planning features.'
  },
  {
    role: 'Manager',
    email: 'manager@example.com',
    password: 'manager123',
    description: 'Team management and reporting capabilities.'
  },
  {
    role: 'Agent',
    email: 'agent@example.com',
    password: 'agent123',
    description: 'Customer service and ticket handling.'
  }
];

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

  const user = useUser();
  const router = useRouter();
  // Direct access to reset the store
  const resetAuthState = useAuthStore(state => state.logout);

  // When component mounts, clear auth cookies AND reset Zustand state
  useEffect(() => {
    const resetAuth = async () => {
      // Clear cookies first
      clearAuthCookies();
      // Then reset store state via logout
      await resetAuthState();
    };
    
    resetAuth();
  }, [resetAuthState]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, user]);

  // Function to auto-fill credentials and login
  const loginAsRole = async (roleEmail: string, rolePassword: string) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    // We need to wait for state updates to propagate
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 100);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Test Accounts</p>
            <Accordion type="single" collapsible className="w-full border rounded-md">
              {roleCredentials.map((roleData, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="py-2 px-3 hover:no-underline">
                    <span className="font-medium text-sm">{roleData.role}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-2 text-xs">
                    <p className="text-muted-foreground mb-2">{roleData.description}</p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 mb-2">
                      <span className="font-medium">Email:</span>
                      <span>{roleData.email}</span>
                      <span className="font-medium">Password:</span>
                      <span>{roleData.password}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={() => loginAsRole(roleData.email, roleData.password)}
                    >
                      Login as {roleData.role}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 