'use client';

import { UserRole, UserStatus, formatRoleName, formatStatus, ExtendedUser } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Users } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/require-role";

// Data table imports
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock user data for demonstration
const mockUsers: ExtendedUser[] = [
  { 
    id: '1', 
    name: 'John Admin', 
    email: 'admin@email.com', 
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    hireDate: '2020-01-15',
    manager: null
  },
  { 
    id: '2', 
    name: 'Sara Planner', 
    email: 'planner@example.com', 
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-03-22',
    manager: '1' 
  },
  { 
    id: '3', 
    name: 'Mike Manager', 
    email: 'manager@example.com', 
    role: UserRole.TEAM_MANAGER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-05-10',
    manager: '1' 
  },
  { 
    id: '4', 
    name: 'Amy Agent', 
    email: 'agent@example.com', 
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    hireDate: '2022-01-05',
    manager: '3' 
  },
  { 
    id: '5', 
    name: 'David Agent', 
    email: 'david@example.com', 
    role: UserRole.AGENT,
    status: UserStatus.INACTIVE,
    hireDate: '2022-02-15',
    manager: '3' 
  },
  { 
    id: '6', 
    name: 'Emma Planner', 
    email: 'emma@example.com', 
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-11-08',
    manager: '2' 
  },
];

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [users, setUsers] = useState<ExtendedUser[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state for new user
  const [newUser, setNewUser] = useState<Partial<ExtendedUser>>({
    name: '',
    email: '',
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    hireDate: format(new Date(), 'yyyy-MM-dd'),
    manager: null
  });

  // Function to add a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const user: ExtendedUser = {
      id: Math.random().toString(36).substring(7), // Generate random ID
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || UserRole.AGENT,
      status: newUser.status || UserStatus.ACTIVE,
      hireDate: newUser.hireDate || format(new Date(), 'yyyy-MM-dd'),
      manager: newUser.manager || null
    };
    
    setUsers([...users, user]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: UserRole.AGENT,
      status: UserStatus.ACTIVE,
      hireDate: format(new Date(), 'yyyy-MM-dd'),
      manager: null
    });
  };

  // Define columns
  const columns: ColumnDef<ExtendedUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        return <div>{formatRoleName(role)}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        return (
          <Badge 
            variant={status === UserStatus.ACTIVE ? "default" : "destructive"}
            className={status === UserStatus.ACTIVE ? "bg-green-500" : ""}
          >
            {formatStatus(status)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        // Get the status value from the row
        const rowStatus = row.getValue(id) as UserStatus;
        // Check if the filter value matches the row status directly
        return rowStatus === value;
      },
    },
    {
      accessorKey: "hireDate",
      header: "Hire Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("hireDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => {
        const managerId = row.getValue("manager") as string | null;
        if (!managerId) return <div>-</div>;
        const manager = users.find(u => u.id === managerId);
        return <div>{manager?.name || 'Unknown'}</div>;
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id);
        // Special case for "null" value
        if (value === "null" && rowValue === null) {
          return true;
        }
        return value.includes(rowValue as string);
      },
    },
  ];

  // Get unique managers for filter
  const managers = users
    .filter(user => user.role === UserRole.ADMIN || user.role === UserRole.TEAM_MANAGER)
    .map(user => ({ id: user.id, name: user.name }));

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <RequireRole requiredRole={UserRole.ADMIN}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                  >
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {formatRoleName(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value) => setNewUser({ ...newUser, status: value as UserStatus })}
                  >
                    <SelectTrigger id="status" className="col-span-3">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hire-date" className="text-right">
                    Hire Date
                  </Label>
                  <Input
                    id="hire-date"
                    type="date"
                    className="col-span-3"
                    value={newUser.hireDate}
                    onChange={(e) => setNewUser({ ...newUser, hireDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manager" className="text-right">
                    Manager
                  </Label>
                  <Select
                    value={newUser.manager || "no_manager"}
                    onValueChange={(value) => setNewUser({ ...newUser, manager: value === "no_manager" ? null : value })}
                  >
                    <SelectTrigger id="manager" className="col-span-3">
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_manager">No Manager</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by name..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* Role filter */}
                <Select
                  value={(table.getColumn("role")?.getFilterValue() as string) || "all_roles"}
                  onValueChange={(value) => {
                    if (value === "all_roles") {
                      table.getColumn("role")?.setFilterValue(undefined);
                    } else {
                      table.getColumn("role")?.setFilterValue(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_roles">All Roles</SelectItem>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatRoleName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status filter */}
                <Select
                  value={(table.getColumn("status")?.getFilterValue() as string) || "all_statuses"}
                  onValueChange={(value) => {
                    if (value === "all_statuses") {
                      table.getColumn("status")?.setFilterValue(undefined);
                    } else {
                      table.getColumn("status")?.setFilterValue(value as UserStatus);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_statuses">All Statuses</SelectItem>
                    {Object.values(UserStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manager filter */}
                <Select
                  value={(table.getColumn("manager")?.getFilterValue() as string) || "all_managers"}
                  onValueChange={(value) => {
                    if (value === "all_managers") {
                      table.getColumn("manager")?.setFilterValue(undefined);
                    } else if (value === "no_manager") {
                      table.getColumn("manager")?.setFilterValue("null");
                    } else {
                      table.getColumn("manager")?.setFilterValue(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_managers">All Managers</SelectItem>
                    <SelectItem value="no_manager">No Manager</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="px-6">
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-6">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center px-6"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </RequireRole>
  );
} 