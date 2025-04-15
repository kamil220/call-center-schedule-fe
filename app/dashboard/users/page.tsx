'use client';

import { UserRole, UserStatus, ExtendedUser, ApiUser } from "@/types";
import { formatRoleName, formatStatus } from "@/lib/formatters";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { RequireRole } from "@/components/require-role";
import { usersApi } from "@/services/api";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { CreateUserRequestDto, UserRoleApi } from "@/types/users/api.types";

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

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form state for new user
  const [newUser, setNewUser] = useState<Partial<ExtendedUser>>({
    name: '',
    email: '',
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    hireDate: format(new Date(), 'yyyy-MM-dd'),
    manager: null,
    managerName: null
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const dateValue = row.getValue("hireDate");
        if (!dateValue) return <div>-</div>;
        
        try {
          const date = new Date(dateValue as string);
          return <div>{format(date, 'dd/MM/yyyy')}</div>;
        } catch {
          return <div>Invalid date</div>;
        }
      },
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ row }) => {
        const managerName = row.original.managerName;
        if (!managerName) return <div>-</div>;
        return <div>{managerName}</div>;
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id);
        // Special case for "null" value
        if (value === "null" && rowValue === null) {
          return true;
        }
        // For non-null values, check if the value matches
        if (value !== "null" && rowValue !== null) {
          return value === rowValue;
        }
        return false;
      },
    },
  ];

  // Initialize the table
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
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: page,
        pageSize,
      },
    },
  });
  
  // Function to fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Convert our UserRole enum to the API's UserRole string type
      let apiRole: UserRoleApi | undefined;
      const roleFilter = table.getColumn("role")?.getFilterValue() as UserRole | undefined;
      
      if (roleFilter) {
        // Map from our internal enum to the API's string format
        switch (roleFilter) {
          case UserRole.ADMIN: apiRole = 'ROLE_ADMIN'; break;
          case UserRole.AGENT: apiRole = 'ROLE_AGENT'; break;
          case UserRole.PLANNER: apiRole = 'ROLE_PLANNER'; break;
          case UserRole.TEAM_MANAGER: apiRole = 'ROLE_TEAM_MANAGER'; break;
        }
      }
      
      // Convert active/inactive status to boolean for API
      let activeStatus: boolean | undefined;
      const statusFilter = table.getColumn("status")?.getFilterValue() as UserStatus | undefined;
      if (statusFilter !== undefined) {
        activeStatus = statusFilter === UserStatus.ACTIVE;
      }
      
      const response = await usersApi.getUsers({
        page,
        limit: pageSize, // renamed from pageSize to limit to match API
        role: apiRole,
        active: activeStatus,
        name: globalFilter || undefined,
      });
      
      // Map API user type to ExtendedUser type
      const extendedUsers: ExtendedUser[] = response.items.map((apiUser: ApiUser) => {
        // Convert API role format to our UserRole enum
        let role = UserRole.AGENT; // Default
        if (apiUser.roles && apiUser.roles.length > 0) {
          if (apiUser.roles.includes('ROLE_ADMIN')) role = UserRole.ADMIN;
          else if (apiUser.roles.includes('ROLE_PLANNER')) role = UserRole.PLANNER;
          else if (apiUser.roles.includes('ROLE_TEAM_MANAGER')) role = UserRole.TEAM_MANAGER;
        }
        
        return {
          id: apiUser.id,
          email: apiUser.email,
          role,
          status: apiUser.active ? UserStatus.ACTIVE : UserStatus.INACTIVE,
          name: apiUser.fullName || `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim(),
          hireDate: apiUser.hireDate || format(new Date(), 'yyyy-MM-dd'), // Use API hireDate if available, otherwise use current date
          manager: apiUser.manager?.id || null, // Use manager ID from API if available
          managerName: apiUser.manager?.fullName || null, // Store manager name for display
        };
      });
      
      setUsers(extendedUsers);
      setTotalPages(response.totalPages || Math.ceil(response.total / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on initial load and when filters change
  useEffect(() => {
    fetchUsers();
  }, [page, globalFilter, columnFilters]);

  // Validate form fields
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate name has first and last name
    if (!newUser.name) {
      errors.name = "Name is required";
    } else {
      const nameParts = newUser.name.trim().split(' ');
      if (nameParts.length < 2 || !nameParts[1]) {
        errors.name = "Both first and last name are required";
      }
    }
    
    // Validate email
    if (!newUser.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form errors when fields change
  useEffect(() => {
    setFormErrors({});
  }, [newUser]);

  // Function to add a new user
  const handleAddUser = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Split name into first and last name
      const name = newUser.name || '';
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');

      // Create user data for API
      const userData: CreateUserRequestDto = {
        email: newUser.email || '',
        password: 'TemporaryPassword123!', // TODO: Add proper password handling
        firstName,
        lastName,
        roles: [newUser.role === UserRole.ADMIN ? 'ROLE_ADMIN' : 
                newUser.role === UserRole.PLANNER ? 'ROLE_PLANNER' :
                newUser.role === UserRole.TEAM_MANAGER ? 'ROLE_TEAM_MANAGER' : 'ROLE_AGENT']
      };

      await usersApi.createUser(userData);
      
      // Close dialog and reset form first
      setIsDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        hireDate: format(new Date(), 'yyyy-MM-dd'),
        manager: null,
        managerName: null
      });
      setFormErrors({});
      
      // Then show success toast
      toast("User created successfully", {
        description: "The user has been added to the system",
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
        className: "text-foreground dark:text-foreground",
      });
      
      // Refresh users list
      fetchUsers();
    } catch (err: unknown) {
      // Handle backend validation errors
      if (err && typeof err === 'object' && 'errors' in err) {
        const apiErrors = (err as { errors: Record<string, string> }).errors;
        const formattedErrors: Record<string, string> = {};
        
        // Map API error fields to form fields
        if (apiErrors.email) {
          formattedErrors.email = apiErrors.email;
        }
        
        if (apiErrors.lastName) {
          formattedErrors.name = "Last name is required";
        }
        
        if (apiErrors.firstName) {
          formattedErrors.name = "First name is required";
        }
        
        if (Object.keys(formattedErrors).length > 0) {
          setFormErrors(formattedErrors);
        } else {
          toast("Failed to create user", {
            description: extractErrorMessage(err),
            action: {
              label: "Close",
              onClick: () => console.log("Toast closed"),
            },
            className: "text-foreground dark:text-foreground",
          });
        }
      } else {
        toast("Failed to create user", {
          description: extractErrorMessage(err),
          action: {
            label: "Close",
            onClick: () => console.log("Toast closed"),
          },
          className: "text-foreground dark:text-foreground",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to extract error message from various error formats
  const extractErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    
    if (typeof err === 'object' && err !== null) {
      // Check for ApiError with details property that has an error field
      if ('details' in err && err.details && 
          typeof err.details === 'object' && 'error' in err.details) {
        return (err.details as { error: string }).error;
      }
      
      // Direct error field in the error object (e.g., {"error": "message"})
      if ('error' in err && typeof err.error === 'string') {
        return err.error;
      }
      
      // Message property on the object
      if ('message' in err && typeof err.message === 'string') {
        return err.message;
      }
    }
    
    return "An unknown error occurred";
  };

  // Get unique managers for filter
  const managers = users
    .filter(user => user.role === UserRole.ADMIN || user.role === UserRole.TEAM_MANAGER)
    .map(user => ({ 
      id: user.id, 
      name: user.name 
    }));

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
  };

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
                  <div className="col-span-3">
                    <Input
                      id="name"
                      className={formErrors.name ? "border-red-500" : ""}
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      type="email"
                      className={formErrors.email ? "border-red-500" : ""}
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
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
                    onValueChange={(value) => {
                      const manager = value === "no_manager" ? null : managers.find(m => m.id === value);
                      setNewUser({ 
                        ...newUser, 
                        manager: value === "no_manager" ? null : value,
                        managerName: manager ? manager.name : null
                      });
                    }}
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
                <Button type="submit" onClick={handleAddUser} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : "Add User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search by name or email..."
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
                  value={(() => {
                    const filterValue = table.getColumn("manager")?.getFilterValue() as string;
                    if (!filterValue) return "all_managers";
                    if (filterValue === "null") return "no_manager";
                    return filterValue;
                  })()}
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
                    <SelectValue placeholder="Filter by manager">
                      {(() => {
                        const filterValue = table.getColumn("manager")?.getFilterValue() as string;
                        if (!filterValue) return "All Managers";
                        if (filterValue === "null") return "No Manager";
                        const manager = managers.find(m => m.id === filterValue);
                        return manager ? manager.name : "All Managers";
                      })()}
                    </SelectValue>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
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

            <Pagination 
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              showPageSizeOptions
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </Card>
      </div>
    </RequireRole>
  );
} 