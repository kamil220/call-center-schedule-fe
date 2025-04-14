'use client';

import React, { ReactNode } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
} 