"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeaveRequest, LeaveRequestStatus } from "@/types/users/domain.types";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";

interface LeaveRequestsProps {
  requests: LeaveRequest[];
}

const statusStyles = {
  [LeaveRequestStatus.PENDING]: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  [LeaveRequestStatus.APPROVED]: "bg-green-100 text-green-800 hover:bg-green-200",
  [LeaveRequestStatus.REJECTED]: "bg-red-100 text-red-800 hover:bg-red-200",
};

const typeLabels = {
  vacation: "Annual Leave",
  sick_leave: "Sick Leave",
  other: "Other",
};

export function LeaveRequests({ requests }: LeaveRequestsProps) {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="rounded-full bg-primary/10 p-3">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
          <ScrollArea className="h-[200px] w-full">
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{typeLabels[request.type]}</span>
                      <Badge variant="outline" className={statusStyles[request.status]}>
                        {request.status === LeaveRequestStatus.PENDING && "Pending"}
                        {request.status === LeaveRequestStatus.APPROVED && "Approved"}
                        {request.status === LeaveRequestStatus.REJECTED && "Rejected"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(request.startDate), "d MMMM yyyy")} -{" "}
                      {format(new Date(request.endDate), "d MMMM yyyy")}
                    </div>
                    {request.comment && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Comment: {request.comment}
                      </p>
                    )}
                    {request.responseComment && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Response: {request.responseComment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
} 