'use client';

import { useState, useEffect } from "react";
import { CallHistoryTable } from "@/components/call-history-table"
import { Card } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { callService, type CallDetails } from "@/services/call.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// Sample data for operators and lines
const operators = [
  "Jack Davis",
  "Emma Wilson",
  "Michael Brown",
];

const lines = [
  "Sales",
  "Customer Service",
  "Technical",
];

function CallHistoryTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, j) => (
            <Skeleton key={j} className="h-12" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CallHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<CallDetails[]>([]);

  useEffect(() => {
    async function loadCalls() {
      try {
        const data = await callService.getCalls();
        setCalls(data);
      } catch (error: unknown) {
        console.error('Failed to load calls:', error);
        toast.error("Failed to load calls");
      } finally {
        setIsLoading(false);
      }
    }

    loadCalls();
  }, []);

  // Filter data based on search query and filters
  const filteredData = calls.filter(item => {
    const matchesSearch = !searchQuery || 
      item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLine = !selectedLine || item.line === selectedLine;
    const matchesOperator = !selectedOperator || item.operator === selectedOperator;

    return matchesSearch && matchesLine && matchesOperator;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Phone className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold">Call History</h1>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by phone number or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Line filter */}
              <Select
                value={selectedLine || "all_lines"}
                onValueChange={(value) => setSelectedLine(value === "all_lines" ? null : value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by line" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_lines">All Lines</SelectItem>
                  {lines.map((line) => (
                    <SelectItem key={line} value={line}>
                      {line}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Operator filter */}
              <Select
                value={selectedOperator || "all_operators"}
                onValueChange={(value) => setSelectedOperator(value === "all_operators" ? null : value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_operators">All Operators</SelectItem>
                  {operators.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <CallHistoryTableSkeleton />
          ) : (
            <CallHistoryTable data={paginatedData} />
          )}

          <Pagination 
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            showPageSizeOptions
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  )
} 