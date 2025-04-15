/**
 * Formatting utility functions
 */

import { UserRole, UserStatus } from '@/types/users/domain.types';

/**
 * Format a user role enum value to a user-friendly display string
 * 
 * @param role - The domain UserRole enum value
 * @returns A user-friendly string representation of the role
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
      // Handle potential unknown roles gracefully
      const exhaustiveCheck: never = role;
      return String(exhaustiveCheck);
  }
};

/**
 * Format user status enum value for display
 * 
 * @param status - The domain UserStatus enum value
 * @returns A user-friendly string representation of the status
 */
export const formatStatus = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Active';
    case UserStatus.INACTIVE:
      return 'Inactive';
    default:
      const exhaustiveCheck: never = status;
      return String(exhaustiveCheck);
  }
}; 