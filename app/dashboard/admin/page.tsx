'use client';

import { RoleGuard } from "@/components/role-guard";
import { UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <RoleGuard requiredRole={UserRole.ADMIN}>
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-8 gap-3">
          <Shield className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This section is only accessible to administrators.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This section is only accessible to administrators.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View system activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This section is only accessible to administrators.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
} 