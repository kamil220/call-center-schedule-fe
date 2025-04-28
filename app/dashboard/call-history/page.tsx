'use client';

import { useState, useEffect } from "react";
import { CallHistoryTable } from "@/components/call-history-table"
import { Card } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { callService } from "@/services/call.service"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Call, GetCallsParams } from "@/types/calls";
import { Filters } from "./components/filters";
import { useRoleCheck } from "@/hooks/use-role-check";

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
  const { isAdmin, isTeamManager, isPlanner } = useRoleCheck();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [calls, setCalls] = useState<Call[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    operatorId: null as string | null,
    lineId: null as string | null,
    skillPathId: null as number | null,
    search: ''
  });

  // Show operator filter for admin, team manager, and planner roles
  const showOperatorFilter = isAdmin || isTeamManager || isPlanner;

  // Load calls with current filters
  const loadCalls = async (params: GetCallsParams) => {
    try {
      setIsLoading(true);
      const data = await callService.getCalls({
        page: params.page,
        limit: params.limit,
        phoneNumber: params.phoneNumber,
        lineId: params.lineId ? Number(params.lineId) : undefined,
        operatorId: params.operatorId || undefined,
        skillPathId: params.skillPathId || undefined,
      });
      setCalls(data.items);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      console.error('Failed to load calls:', error);
      toast.error("Failed to load calls");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to reload data when filters change
  useEffect(() => {
    const params: GetCallsParams = {
      page,
      limit,
      phoneNumber: filters.search || undefined,
      lineId: filters.lineId ? Number(filters.lineId) : undefined,
      operatorId: filters.operatorId || undefined,
      skillPathId: filters.skillPathId || undefined,
    };

    loadCalls(params);
  }, [page, limit, filters]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Phone className="text-primary h-8 w-8" />
        <h1 className="text-3xl font-bold">Call History</h1>
      </div>
      
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <Filters 
            onFilterChange={setFilters}
            showOperatorFilter={showOperatorFilter}
          />

          {isLoading ? (
            <CallHistoryTableSkeleton />
          ) : (
            <CallHistoryTable data={calls} />
          )}

          <Pagination 
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={limit}
            onPageSizeChange={setLimit}
            showPageSizeOptions
            isLoading={isLoading}
          />
        </div>
      </Card>
    </div>
  )
} 