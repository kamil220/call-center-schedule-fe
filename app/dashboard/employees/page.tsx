'use client';

import { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, PlusIcon } from "lucide-react";
import { RequireRole } from "@/components/require-role";
import { UserRole } from "@/types";
import { Input } from "@/components/ui/input";

// Przykładowe dane pracowników
const mockEmployees = Array.from({ length: 50 }).map((_, index) => ({
  id: `emp-${index + 1}`,
  name: `Employee ${index + 1}`,
  department: index % 3 === 0 ? 'Sales' : index % 3 === 1 ? 'Support' : 'Development',
  position: index % 4 === 0 ? 'Manager' : 'Specialist',
  joinDate: new Date(2020 + Math.floor(index / 10), index % 12, (index % 28) + 1).toISOString().split('T')[0]
}));

export default function EmployeesPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(Math.ceil(mockEmployees.length / pageSize));
  
  // Filtrowanie i paginacja
  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentPageEmployees = filteredEmployees.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  
  // Aktualizacja totalPages przy zmianie filtrów
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEmployees.length / pageSize));
  }, [filteredEmployees.length, pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Reset also to page 0 when changing page size
    setPage(0);
  };
  
  return (
    <RequireRole requiredRole={UserRole.TEAM_MANAGER}>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="text-primary h-8 w-8" />
            <h1 className="text-3xl font-bold">Employees</h1>
          </div>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Department</th>
                    <th className="text-left p-4 font-medium">Position</th>
                    <th className="text-left p-4 font-medium">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t hover:bg-muted/50">
                      <td className="p-4">{employee.name}</td>
                      <td className="p-4">{employee.department}</td>
                      <td className="p-4">{employee.position}</td>
                      <td className="p-4">{new Date(employee.joinDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {currentPageEmployees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-8 text-muted-foreground">
                        No employees found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <Pagination 
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPageNumbers
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