import { ApiEmploymentType, ApiLeaveType } from "@/types";

interface LeaveTypeOption {
  value: ApiLeaveType;
  label: string;
  description: string;
}

const ALL_LEAVE_TYPES: LeaveTypeOption[] = [
  {
    value: ApiLeaveType.SICK_LEAVE,
    label: "Sick Leave",
    description: "Time off due to illness or medical condition"
  },
  {
    value: ApiLeaveType.HOLIDAY,
    label: "Holiday",
    description: "Annual paid vacation leave"
  },
  {
    value: ApiLeaveType.PERSONAL_LEAVE,
    label: "Personal Leave",
    description: "Time off for personal matters"
  },
  {
    value: ApiLeaveType.PATERNITY_LEAVE,
    label: "Paternity Leave",
    description: "Leave for fathers after child birth"
  },
  {
    value: ApiLeaveType.MATERNITY_LEAVE,
    label: "Maternity Leave",
    description: "Leave for mothers before and after child birth"
  }
];

const BASIC_LEAVE_TYPES = [ApiLeaveType.SICK_LEAVE, ApiLeaveType.PERSONAL_LEAVE];

export function useAvailableLeaveTypes(employmentType: ApiEmploymentType | null) {
  const getAvailableLeaveTypes = (): LeaveTypeOption[] => {
    if (!employmentType) return [];

    switch (employmentType) {
      case ApiEmploymentType.EMPLOYMENT_CONTRACT:
        // Employment contract (UoP) gets all leave types
        return ALL_LEAVE_TYPES;
      
      case ApiEmploymentType.CIVIL_CONTRACT:
      case ApiEmploymentType.CONTRACTOR:
        // B2B and civil contract only get basic leave types
        return ALL_LEAVE_TYPES.filter(type => 
          BASIC_LEAVE_TYPES.includes(type.value)
        );
      
      default:
        return [];
    }
  };

  return {
    leaveTypes: getAvailableLeaveTypes()
  };
} 