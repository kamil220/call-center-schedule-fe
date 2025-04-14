'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { useAuthStatus, useHasRole } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  fallback 
}: RoleGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const hasRequiredRole = useHasRole(requiredRole);
  const router = useRouter();

  useEffect(() => {
    // Only check after authentication is determined
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else if (!hasRequiredRole) {
        // Redirect to forbidden page if authenticated but lacks required role
        router.push('/forbidden');
      }
    }
  }, [isLoading, isAuthenticated, hasRequiredRole, router]);

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or doesn't have the role, show fallback or nothing while redirecting
  if (!isAuthenticated || !hasRequiredRole) {
    return fallback || null;
  }

  // Render children when authenticated and has required role
  return <>{children}</>;
} 