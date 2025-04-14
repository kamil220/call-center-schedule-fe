'use client';

import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, PlusIcon, TrashIcon, Users } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/require-role";

// Mock user data for demonstration
const mockUsers = [
  { id: '1', name: 'John Admin', email: 'admin@email.com', role: UserRole.ADMIN },
  { id: '2', name: 'Sara Planner', email: 'planner@example.com', role: UserRole.PLANNER },
  { id: '3', name: 'Mike Manager', email: 'manager@example.com', role: UserRole.TEAM_MANAGER },
  { id: '4', name: 'Amy Agent', email: 'agent@example.com', role: UserRole.AGENT },
];

export default function UsersPage() {
  const [users] = useState(mockUsers);

  return (
    <RequireRole requiredRole={UserRole.ADMIN}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Manage all users and their permissions within the system.
              Only administrators can access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
} 