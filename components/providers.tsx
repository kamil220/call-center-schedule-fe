'use client';

import React from 'react';
// This component acts as a client boundary
// It wraps providers that need client-side logic (like AuthProvider)
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 