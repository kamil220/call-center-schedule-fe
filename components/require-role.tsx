'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { useHasRole, useUser } from '@/store/auth.store';

interface RequireRoleProps {
  children: ReactNode;
  requiredRole: UserRole;
}

/**
 * Component that ONLY checks for role permissions
 * Does not handle authentication or cookie syncing - assumes that is handled by parent ProtectedRoute
 */
export function RequireRole({ children, requiredRole }: RequireRoleProps) {
  const hasRequiredRole = useHasRole(requiredRole);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log('RequireRole [DEBUG]:', { 
      hasRequiredRole,
      requiredRole,
      userRole: user?.role
    });

    // If user doesn't have required role, redirect to forbidden page
    if (!hasRequiredRole) {
      console.log('RequireRole [DEBUG]: User lacks required role, redirecting to forbidden');
      router.push('/forbidden');
    } else {
      console.log('RequireRole [DEBUG]: User has required role, rendering children');
    }
  }, [hasRequiredRole, router, requiredRole, user?.role]);

  // If doesn't have the role, render nothing while redirecting
  if (!hasRequiredRole) {
    console.log('RequireRole [DEBUG]: Not showing content, waiting for redirect');
    return null;
  }

  // Render children when user has required role
  return <>{children}</>;
} 