'use client';

import { useEffect } from 'react';
import { useAuthActions } from '@/store/auth.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { syncWithCookies } = useAuthActions();

  useEffect(() => {
    syncWithCookies();
  }, [syncWithCookies]);

  return (
    <>
      {children}
    </>
  );
} 