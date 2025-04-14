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