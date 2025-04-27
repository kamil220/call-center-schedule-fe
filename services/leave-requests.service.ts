import { ApiLeaveType } from "@/types";
import { api } from "@/services/api";

export interface CreateLeaveRequestDto {
  type: ApiLeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface LeaveRequestResponse {
  id: string;
  type: ApiLeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export const leaveRequestsService = {
  create: async (data: CreateLeaveRequestDto): Promise<LeaveRequestResponse> => {
    return api.post<LeaveRequestResponse, CreateLeaveRequestDto>('/work-schedule/leave-requests', data);
  },
}; 