'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuthStatus, useAuthActions } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const { syncWithCookies } = useAuthActions();
  const router = useRouter();

  // Sync with cookies when component mounts
  useEffect(() => {
    syncWithCookies();
  }, [syncWithCookies]);

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex h-screen bg-muted/40">
          <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 