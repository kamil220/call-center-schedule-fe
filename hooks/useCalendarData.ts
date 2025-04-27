import { useState, useEffect, useCallback } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { formatDateForApi } from "@/lib/calendarUtils";
import { calendarService } from "@/services/calendar.service";
import type { ScheduleEntry } from "@/types/calendar.types";
import type { Holiday } from "@/types/calendar/api.types";

export function useCalendarData(userId: string) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [scheduleEntries, setScheduleEntries] = useState<Map<string, ScheduleEntry[]>>(new Map());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    setIsLoadingAvailability(true);
    try {
      const response = await calendarService.getUserAvailability(
        userId,
        format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
        format(endOfMonth(currentMonth), 'yyyy-MM-dd')
      );

      const entriesMap = new Map<string, ScheduleEntry[]>();
      response.forEach(entry => {
        const dateKey = formatDateForApi(new Date(entry.date));
        const existingEntries = entriesMap.get(dateKey) || [];
        entriesMap.set(dateKey, [...existingEntries, entry as ScheduleEntry]);
      });

      setScheduleEntries(entriesMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability data');
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [userId, currentMonth]);

  const fetchHolidays = useCallback(async () => {
    setIsLoadingHolidays(true);
    try {
      const response = await calendarService.getHolidays(currentYear);
      setHolidays(response as Holiday[]);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error('Failed to load holiday data');
    } finally {
      setIsLoadingHolidays(false);
    }
  }, [currentYear]);

  useEffect(() => {
    fetchData();
    fetchHolidays();
  }, [fetchData, fetchHolidays]);

  const findHolidayForDate = (date: Date): Holiday | null => {
    if (date.getFullYear() !== currentYear) {
      return null;
    }
    const formattedDate = formatDateForApi(date);
    return holidays.find(h => h.date === formattedDate) || null;
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    const year = date.getFullYear();
    if (year !== currentYear) {
      setCurrentYear(year);
    }
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (today.getFullYear() !== currentYear) {
      setCurrentYear(today.getFullYear());
    }
  };

  const refreshData = useCallback(() => {
    fetchData();
    fetchHolidays();
  }, [fetchData, fetchHolidays]);

  return {
    selectedRange,
    setSelectedRange,
    scheduleEntries,
    holidays,
    isLoadingHolidays,
    isLoadingAvailability,
    currentYear,
    currentMonth,
    findHolidayForDate,
    handleMonthChange,
    goToToday,
    refreshData
  };
} 