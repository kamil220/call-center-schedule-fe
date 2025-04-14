'use client';

import React, { ReactNode, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { useAuthStatus } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();

  // Use useEffect to handle redirection after render
  useEffect(() => {
    // Only check/redirect once loading is finished
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]); // Dependencies: run effect if these change

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading and not authenticated, render null while useEffect redirects
  // This prevents rendering the dashboard layout briefly before redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render dashboard layout only if authenticated and not loading
  return (
    <div className="flex h-screen bg-muted/40">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
} 