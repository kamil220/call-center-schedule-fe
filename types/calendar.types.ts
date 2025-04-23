// --- New API Response Types ---
export interface BaseMeta {
  id: string;
}

export interface AvailabilityMeta extends BaseMeta {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface LeaveMeta extends BaseMeta {
  leaveType: string; // e.g., "vacation", "sick_leave"
  leaveTypeLabel: string; // User-friendly label, e.g., "Vacation", "Sick Leave"
  status: "pending" | "approved" | "rejected" | "cancelled";
  reason: string | null;
  color: string; // Hex color code, e.g., "#FFD700"
}

export interface ScheduleEntry {
  date: string; // YYYY-MM-DD
  type: "available" | "leave";
  meta: AvailabilityMeta | LeaveMeta;
}

// Existing Holiday type (assuming it's used elsewhere or stays)
export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
} 