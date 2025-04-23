import { format } from "date-fns";

// Format date for API requests (YYYY-MM-DD)
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
}; 