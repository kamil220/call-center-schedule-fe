"use client";

import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton"; // Kept for summary shimmer
import { CalendarShimmer } from "@/components/availability/CalendarShimmer";

import { cn } from "@/lib/utils";
import { formatDateForApi } from "@/lib/calendarUtils"; 
import { calendarService } from "@/services/calendar.service";
import type { Holiday, ScheduleEntry, AvailabilityMeta, LeaveMeta } from "@/types/calendar.types";


// Simplified status styles for DayContent background
const statusStyles = {
  available: "bg-green-50 hover:bg-green-100 text-green-700",
  leave: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700", 
  holiday: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  unavailable: "bg-gray-50 hover:bg-gray-100 text-gray-500",
  default: "bg-white hover:bg-gray-50",
};

interface UserAvailabilityCalendarProps {
  userId: string;
}

export function UserAvailabilityCalendar({ userId }: UserAvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [scheduleEntries, setScheduleEntries] = useState<Map<string, ScheduleEntry[]>>(new Map());
  
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Fetch holidays when the year changes
  useEffect(() => {
    async function fetchHolidays() {
      setIsLoadingHolidays(true);
      try {
        // Assert the type from the service call
        const holidayData = (await calendarService.getHolidays(currentYear)) as unknown as Holiday[];
        setHolidays(holidayData);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      } finally {
        setIsLoadingHolidays(false);
      }
    }

    fetchHolidays();
  }, [currentYear]);

  // Fetch user availability when month or user changes
  useEffect(() => {
    async function fetchUserAvailability() {
      if (!userId) return;
      
      setIsLoadingAvailability(true);
      try {
        const firstDayOfMonth = startOfMonth(currentMonth);
        const dayOfWeek = firstDayOfMonth.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const firstVisibleDay = new Date(firstDayOfMonth);
        firstVisibleDay.setDate(firstDayOfMonth.getDate() - daysToSubtract);
        
        const lastDayOfMonth = endOfMonth(currentMonth);
        const lastDayOfWeekday = lastDayOfMonth.getDay(); 
        const daysToAdd = lastDayOfWeekday === 0 ? 0 : 7 - lastDayOfWeekday;
        const lastVisibleDay = new Date(lastDayOfMonth);
        lastVisibleDay.setDate(lastDayOfMonth.getDate() + daysToAdd);
        
        const startDateFormatted = formatDateForApi(firstVisibleDay);
        const endDateFormatted = formatDateForApi(lastVisibleDay);
        
        // Fetch and cast - Using 'unknown' first as suggested by linter
        const scheduleData = (await calendarService.getUserAvailability(
          userId,
          startDateFormatted,
          endDateFormatted
        )) as unknown as ScheduleEntry[]; 
        
        const entriesMap = new Map<string, ScheduleEntry[]>();
        scheduleData.forEach(entry => {
          const dateKey = entry.date; 
          const entriesForDate = entriesMap.get(dateKey) || [];
          entriesForDate.push(entry);
          // Sort entries for the day (available first, then by start time, then leave)
          entriesForDate.sort((a, b) => {
             if (a.type === 'available' && b.type !== 'available') return -1;
             if (a.type !== 'available' && b.type === 'available') return 1;
             if (a.type === 'available' && b.type === 'available') {
               return (a.meta as AvailabilityMeta).startTime.localeCompare((b.meta as AvailabilityMeta).startTime);
             }
             // Add sorting for leave types if needed (e.g., alphabetically)
             return 0; 
          });
          entriesMap.set(dateKey, entriesForDate);
        });
        
        setScheduleEntries(entriesMap);

      } catch (error) {
        console.error("Failed to fetch user schedule:", error);
      } finally {
        setIsLoadingAvailability(false);
      }
    }

    fetchUserAvailability();
  }, [userId, currentMonth]);

  // Memoize or define inside component if state dependency is simple
  const findHolidayForDate = (date: Date): Holiday | null => {
    if (date.getFullYear() !== currentYear) {
      return null; // Optimization: Quick check if year matches loaded holidays
    }
    const formattedDate = formatDateForApi(date);
    return holidays.find(h => h.date === formattedDate) || null;
  };


  const handleSaveAvailability = () => {
    console.warn("handleSaveAvailability needs update for the new API structure");
    if (!selectedRange?.from) return;

    // TODO: Implement saving logic based on new API structure.
    // This will likely involve creating/updating ScheduleEntry objects.

    setSelectedRange(undefined);
    setIsDialogOpen(false);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    const year = date.getFullYear();
    if (year !== currentYear) {
      setCurrentYear(year); // Triggers holiday fetch
    }
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (today.getFullYear() !== currentYear) {
      setCurrentYear(today.getFullYear());
    }
  };

  // Consider memoizing this calculation if performance becomes an issue
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
          // Assumes each 'leave' entry represents one day
          summary.leaveDays += 1; 
        }
      });
    });

    return summary;
  };

  const handleDateSelectForDialog = (date: Date | undefined) => {
    if (!date) return;

    const publicHoliday = findHolidayForDate(date);
    if (publicHoliday) return; // Don't open dialog for public holidays

    // Optional: Prevent opening dialog for leave days if desired
    // const entries = scheduleEntries.get(formatDateForApi(date)) || [];
    // const isLeave = entries.some(e => e.type === 'leave');
    // if (isLeave) return; 

    setSelectedRange({ from: date, to: date });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mx-4 my-2">
        <h2 className="text-2xl font-semibold">Your Availability Calendar</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToToday}
        >
          Today
        </Button>
      </div>
      
      {isLoadingHolidays || isLoadingAvailability ? (
        <CalendarShimmer />
      ) : (
        <Calendar
          mode="single" // Keep single mode for triggering the dialog on click
          selected={selectedRange?.from} // Highlight the day dialog is open for
          onSelect={handleDateSelectForDialog} // Use specific handler for opening dialog
          month={currentMonth}
          onMonthChange={handleMonthChange}
          className="w-full"
          classNames={{
            months: "w-full",
            month: "w-full space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-8",
            caption_label: "text-lg font-semibold",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7 gap-2 mb-2",
            head_cell: "text-muted-foreground font-medium text-sm text-center",
            row: "grid grid-cols-7 gap-2 mt-2",
            cell: "relative p-0 text-center",
            day: "h-14 w-full p-0 font-normal", 
            day_selected: "", // Clear default selection style, handled in DayContent
            day_today: "", // Remove default today style, handled in DayContent
            day_hidden: "invisible",
          }}
          components={{
            DayContent: ({ date }) => {
              const dateKey = formatDateForApi(date);
              const entries = scheduleEntries.get(dateKey) || [];
              const publicHoliday = findHolidayForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();

              let dayStatus: 'available' | 'leave' | 'holiday' | 'unavailable' = 'unavailable';
              let content = null;
              let tooltipContent: string | null = null;
              const customStyle: React.CSSProperties = {};

              if (publicHoliday) {
                dayStatus = 'holiday';
                tooltipContent = publicHoliday.description;
                content = <div className="text-[10px] font-medium mt-1">Holiday</div>;
              } else if (entries.length > 0) {
                 const leaveEntry = entries.find(e => e.type === 'leave');
                 if (leaveEntry) {
                    dayStatus = 'leave';
                    const meta = leaveEntry.meta as LeaveMeta;
                    content = <div className="text-[10px] font-medium mt-1">{meta.leaveTypeLabel}</div>;
                    tooltipContent = meta.reason; // Show reason in tooltip
                    if (meta.color) {
                       // Apply color from meta, ensure sufficient contrast or adjust text color
                       customStyle.backgroundColor = meta.color; 
                       // Basic contrast check needed here if colors vary widely
                       customStyle.color = "#333"; // Example: default dark text
                    }
                 } else {
                    dayStatus = 'available';
                    const availableEntries = entries.filter(e => e.type === 'available') as (ScheduleEntry & { meta: AvailabilityMeta })[];
                    // Display multiple time slots if they exist
                    content = availableEntries.map(entry => (
                      <div key={entry.meta.id} className="text-[10px] font-medium mt-0.5 leading-tight"> 
                        {entry.meta.startTime}-{entry.meta.endTime}
                      </div>
                    ));
                 }
              } else {
                dayStatus = 'unavailable'; 
              }
              
              const dayClasses = cn(
                "h-14 w-full flex flex-col justify-center items-center rounded-lg transition-colors cursor-pointer", // Added cursor-pointer
                statusStyles[dayStatus] || statusStyles.default,
                isToday && "ring-2 ring-primary ring-offset-1", // Enhanced today highlight
                isOutsideMonth && "opacity-40 pointer-events-none", // Disable clicks outside month
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              );

              const dayElement = (
                <div className={dayClasses} style={customStyle}>
                  <div className={cn("text-sm font-medium", isToday && "font-bold")}> {/* Make today's date bold */}
                    {date.getDate()}
                  </div>
                  {content}
                </div>
              );

              if (tooltipContent) {
                return (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>{dayElement}</TooltipTrigger>
                      <TooltipContent><p>{tooltipContent}</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return dayElement;
            },
          }}
        />
      )}

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        {isLoadingAvailability ? ( // Only shimmer summary if availability is loading
          <>
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Working Hours</span>
              <span className="text-2xl font-semibold text-green-700">{calculateSummary().workingHours}h</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-700">Leave Days</span>
              <span className="text-2xl font-semibold text-yellow-700">{calculateSummary().leaveDays}d</span>
            </div>
             <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Holidays (Month)</span> 
              <span className="text-2xl font-semibold text-gray-700">
                {holidays.filter(h => new Date(h.date).getMonth() === currentMonth.getMonth()).length}d
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 