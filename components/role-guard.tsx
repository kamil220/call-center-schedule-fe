'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { useHasRole, useUser } from '@/store/auth.store';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

/**
 * RoleGuard component only checks for role permissions
 * It assumes the user is already authenticated (handled by ProtectedRoute)
 */
export function RoleGuard({ 
  children, 
  requiredRole, 
  fallback 
}: RoleGuardProps) {
  const hasRequiredRole = useHasRole(requiredRole);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {

    // If user doesn't have required role, redirect to forbidden page
    if (!hasRequiredRole) {
      router.push('/forbidden');
    }
  }, [hasRequiredRole, router, requiredRole, user?.role]);

  // If doesn't have the role, show fallback or nothing while redirecting
  if (!hasRequiredRole) {
    return fallback || null;
  }

  // Render children when user has required role
  return <>{children}</>;
} 