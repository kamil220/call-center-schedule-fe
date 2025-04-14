'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus, useAuthActions } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A wrapper component that handles ONLY authentication (not role-based access)
 * 
 * - First syncs auth state with cookies
 * - Redirects to login if not authenticated
 * - If authenticated, renders children
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const { syncWithCookies } = useAuthActions();
  const router = useRouter();
  // Local state to prevent double syncing
  const [hasSynced, setHasSynced] = useState(false);

  // Sync with cookies only once on mount
  useEffect(() => {
    if (!hasSynced) {
      syncWithCookies();
      setHasSynced(true);
    }
  }, [syncWithCookies, hasSynced]);

  // Handle authentication status
  useEffect(() => {
    if (hasSynced) {
      // Only redirect after loading is finished and we know the user isn't authenticated
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, hasSynced]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasSynced) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything while redirecting to login
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
} 