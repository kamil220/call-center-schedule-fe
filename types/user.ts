// Enum defining possible user roles based on documentation
export enum UserRole {
  ADMIN = 'ADMIN', // Can add Planners
  PLANNER = 'PLANNER', // Planista
  TEAM_MANAGER = 'TEAM_MANAGER', // Team Manager
  AGENT = 'AGENT', // Agent
}

// Enum for user status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Available specialization tags for employees
export type SpecializationTag = 
  | 'Sales' 
  | 'Technical Support' 
  | 'Customer Service' 
  | 'Administration' 
  | 'HR' 
  | 'IT' 
  | 'Management';

// Rating scale (1-5)
export type Rating = 1 | 2 | 3 | 4 | 5;

// Schedule day types
export type ScheduleDayType = 'work' | 'vacation' | 'sick';

// Schedule day structure
export interface ScheduleDay {
  type: ScheduleDayType;
  shift?: string;
  hours?: string;
  specializations?: string[];
  reason?: string;
}

// Efficiency details structure
export interface EfficiencyDetails {
  overall: Rating;
  workSpeed: Rating;
  confidence: Rating;
  knowledge: Rating;
}

// Employee comment structure
export interface EmployeeComment {
  id: string;
  authorId: string;
  date: string; // ISO date
  content: string;
}

/**
 * Format a user role enum value to a user-friendly display string
 * Can be used anywhere in the application for consistent role presentation
 */
export const formatRoleName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.PLANNER:
      return 'Planner';
    case UserRole.TEAM_MANAGER:
      return 'Team Manager';
    case UserRole.AGENT:
      return 'Agent';
    default:
      return role;
  }
};

/**
 * Format user status for display
 */
export const formatStatus = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Active';
    case UserStatus.INACTIVE:
      return 'Inactive';
    default:
      return status;
  }
};

// Interface defining the structure of a User object
export interface User {
  id: string; // Or number, depending on your backend
  email: string;
  role: UserRole;
  status: UserStatus;
  // Add other fields like name, avatarUrl etc. as needed
}

// Extended user type with additional fields for the dashboard
export interface ExtendedUser extends User {
  name: string;
  hireDate: string; // ISO date string
  manager: string | null; // ID of the manager
}

// Employee type with all the extended information
export interface Employee extends ExtendedUser {
  specializations: SpecializationTag[];
  efficiency: EfficiencyDetails;
  workload: number; // Percentage 0-100
  comments: EmployeeComment[];
  schedule?: Record<string, ScheduleDay>; // Date -> Schedule day information
  // Additional fields for employee profile
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
} 