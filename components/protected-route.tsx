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
      console.log('ProtectedRoute [DEBUG]: Initial sync with cookies');
      syncWithCookies();
      setHasSynced(true);
    }
  }, [syncWithCookies, hasSynced]);

  // Handle authentication status
  useEffect(() => {
    if (hasSynced) {
      console.log('ProtectedRoute [DEBUG]:', { isAuthenticated, isLoading });
      
      // Only redirect after loading is finished and we know the user isn't authenticated
      if (!isLoading && !isAuthenticated) {
        console.log('ProtectedRoute [DEBUG]: Not authenticated, redirecting to login');
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, hasSynced]);

  // Show loading spinner while checking authentication
  if (isLoading || !hasSynced) {
    console.log('ProtectedRoute [DEBUG]: Loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything while redirecting to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute [DEBUG]: Not authenticated, rendering null');
    return null;
  }

  // User is authenticated, render children
  console.log('ProtectedRoute [DEBUG]: Authenticated, rendering children');
  return <>{children}</>;
} 