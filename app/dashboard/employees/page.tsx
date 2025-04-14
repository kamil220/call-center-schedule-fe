'use client';

import { UserRole, UserStatus, formatRoleName, Employee, SpecializationTag, Rating } from "@/types/user";
import type { EfficiencyDetails } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/require-role";
import { useHasRole } from "@/store/auth.store";

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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Helper function to generate random efficiency details
const generateEfficiency = (): EfficiencyDetails => {
  const getRandomRating = (): Rating => {
    return Math.floor(Math.random() * 5 + 1) as Rating;
  };
  
  const workSpeed = getRandomRating();
  const confidence = getRandomRating();
  const knowledge = getRandomRating();
  // Calculate overall as average of components rounded to nearest integer
  const overall = Math.round((workSpeed + confidence + knowledge) / 3) as Rating;
  
  return {
    overall,
    workSpeed,
    confidence,
    knowledge
  };
};

// Generate mock employees data based on user data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@email.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    hireDate: '2020-01-15',
    manager: null,
    specializations: ['Management', 'IT'],
    efficiency: generateEfficiency(),
    workload: 85,
    comments: [],
    avatar: "/avatars/john.jpg",
    phoneNumber: "+48 123 456 789",
    address: "ul. Warszawska 10, 00-001 Warszawa",
    emergencyContact: "Anna Admin, +48 987 654 321"
  },
  {
    id: '2',
    name: 'Sara Planner',
    email: 'planner@example.com',
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-03-22',
    manager: '1',
    specializations: ['HR', 'Management'],
    efficiency: generateEfficiency(),
    workload: 75,
    comments: [],
    avatar: "/avatars/sara.jpg"
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'manager@example.com',
    role: UserRole.TEAM_MANAGER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-05-10',
    manager: '1',
    specializations: ['Sales', 'Management'],
    efficiency: generateEfficiency(),
    workload: 65,
    comments: []
  },
  {
    id: '4',
    name: 'Amy Agent',
    email: 'agent@example.com',
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    hireDate: '2022-01-05',
    manager: '3',
    specializations: ['Customer Service', 'Sales'],
    efficiency: generateEfficiency(),
    workload: 95,
    comments: []
  },
  {
    id: '5',
    name: 'David Agent',
    email: 'david@example.com',
    role: UserRole.AGENT,
    status: UserStatus.INACTIVE,
    hireDate: '2022-02-15',
    manager: '3',
    specializations: ['Technical Support'],
    efficiency: generateEfficiency(),
    workload: 0,
    comments: []
  },
  {
    id: '6',
    name: 'Emma Planner',
    email: 'emma@example.com',
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-11-08',
    manager: '2',
    specializations: ['HR', 'Administration'],
    efficiency: generateEfficiency(),
    workload: 80,
    comments: []
  },
];

// Component to render star ratings
const StarRating = ({ rating }: { rating: Rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

// Component to render efficient details in hover card
const EfficiencyDetails = ({ efficiency }: { efficiency: EfficiencyDetails }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Work Speed:</span>
        <StarRating rating={efficiency.workSpeed} />
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Confidence:</span>
        <StarRating rating={efficiency.confidence} />
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Knowledge:</span>
        <StarRating rating={efficiency.knowledge} />
      </div>
    </div>
  );
};

export default function EmployeesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [employees] = useState<Employee[]>(mockEmployees);
  const router = useRouter();
  // Get current user from Zustand store
  const isAdmin = useHasRole(UserRole.ADMIN);
  const isPlanner = useHasRole(UserRole.PLANNER);
  const canViewManagerInfo = isAdmin || isPlanner;

  // Define columns
  const getColumns = (): ColumnDef<Employee>[] => {
    const baseColumns: ColumnDef<Employee>[] = [
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
        accessorKey: "specializations",
        header: "Specializations",
        cell: ({ row }) => {
          const specializations = row.getValue("specializations") as SpecializationTag[];
          return (
            <div className="flex flex-wrap gap-1">
              {specializations.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const specializations = row.getValue(id) as SpecializationTag[];
          return specializations.some(spec => spec === value);
        },
      },
      {
        accessorKey: "efficiency",
        header: "Efficiency",
        cell: ({ row }) => {
          const efficiency = row.getValue("efficiency") as EfficiencyDetails;
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex cursor-help items-center">
                  <StarRating rating={efficiency.overall} />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Efficiency Details</h4>
                    <div className="text-sm">
                      <EfficiencyDetails efficiency={efficiency} />
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
      {
        accessorKey: "workload",
        header: "Workload",
        cell: ({ row }) => {
          const workload = row.getValue("workload") as number;
          return (
            <div className="w-24">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${workload > 90 ? 'bg-red-500' : workload > 75 ? 'bg-amber-500' : 'bg-green-500'}`} 
                  style={{ width: `${workload}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                {workload}%
              </div>
            </div>
          );
        },
      },
    ];

    // Add manager column only for ADMIN or PLANNER roles
    if (canViewManagerInfo) {
      baseColumns.push({
        accessorKey: "manager",
        header: "Manager",
        cell: ({ row }) => {
          const managerId = row.getValue("manager") as string | null;
          if (!managerId) return <div>-</div>;
          const manager = employees.find(u => u.id === managerId);
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
      });
    }

    return baseColumns;
  };

  const columns = getColumns();

  // Get unique managers for filter
  const managers = employees
    .filter(emp => emp.role === UserRole.ADMIN || emp.role === UserRole.TEAM_MANAGER)
    .map(emp => ({ id: emp.id, name: emp.name }));

  // Get unique specializations for filter
  const specializations = Array.from(
    new Set(employees.flatMap(emp => emp.specializations))
  );

  const table = useReactTable({
    data: employees,
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

  // Navigate to employee profile
  const handleRowClick = (employeeId: string) => {
    router.push(`/dashboard/employees/${employeeId}`);
  };

  return (
    <RequireRole requiredRole={UserRole.TEAM_MANAGER}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">Employees</h1>
          </div>
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

                {/* Specialization filter */}
                <Select
                  value={(table.getColumn("specializations")?.getFilterValue() as string) || "all_specializations"}
                  onValueChange={(value) => {
                    if (value === "all_specializations") {
                      table.getColumn("specializations")?.setFilterValue(undefined);
                    } else {
                      table.getColumn("specializations")?.setFilterValue(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_specializations">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manager filter - only show for ADMIN or PLANNER */}
                {canViewManagerInfo && (
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
                )}
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
                        onClick={() => handleRowClick(row.original.id)}
                        className="cursor-pointer hover:bg-muted/50"
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