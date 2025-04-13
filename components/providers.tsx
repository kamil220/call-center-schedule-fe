'use client';

import React from 'react';
import { AuthProvider } from '@/context/auth-context';

// This component acts as a client boundary
// It wraps providers that need client-side logic (like AuthProvider)
export function Providers({ children }: { children: React.ReactNode }) {
  // You can add other client-side providers here if needed in the future
  return <AuthProvider>{children}</AuthProvider>;
} 