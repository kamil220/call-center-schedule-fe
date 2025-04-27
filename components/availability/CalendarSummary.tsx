import { Skeleton } from "@/components/ui/skeleton";
import type { Holiday, ScheduleEntry, AvailabilityMeta } from "@/types/calendar.types";

interface CalendarSummaryProps {
  isLoading: boolean;
  scheduleEntries: Map<string, ScheduleEntry[]>;
  holidays: Holiday[];
  currentMonth: Date;
}

export function CalendarSummary({ isLoading, scheduleEntries, holidays, currentMonth }: CalendarSummaryProps) {
  const calculateSummary = () => {
    const summary = {
      workingHours: 0,
      leaveDays: 0,
    };

    scheduleEntries.forEach(entries => {
      entries.forEach(entry => {
        if (entry.type === 'available') {
          const meta = entry.meta as AvailabilityMeta;
          try {
            const startHour = parseInt(meta.startTime.split(':')[0], 10);
            const endHour = parseInt(meta.endTime.split(':')[0], 10);
            if (!isNaN(startHour) && !isNaN(endHour)) {
              summary.workingHours += (endHour - startHour); 
            }
          } catch (e) {
             console.error("Error parsing time for working hours summary:", meta, e);
          }
        } else if (entry.type === 'leave') {
          summary.leaveDays += 1;
        }
      });
    });

    return summary;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  const summary = calculateSummary();
  const holidaysInMonth = holidays.filter(h => new Date(h.date).getMonth() === currentMonth.getMonth()).length;

  return (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
      <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
        <span className="text-sm font-medium text-green-700">Working Hours</span>
        <span className="text-2xl font-semibold text-green-700">{summary.workingHours}h</span>
      </div>
      <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
        <span className="text-sm font-medium text-yellow-700">Leave Days</span>
        <span className="text-2xl font-semibold text-yellow-700">{summary.leaveDays}d</span>
      </div>
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Holidays (Month)</span>
        <span className="text-2xl font-semibold text-gray-700">{holidaysInMonth}d</span>
      </div>
    </div>
  );
} 