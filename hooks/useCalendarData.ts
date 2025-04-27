import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";

import { formatDateForApi } from "@/lib/calendarUtils";
import { calendarService } from "@/services/calendar.service";
import type { Holiday, ScheduleEntry, AvailabilityMeta } from "@/types/calendar.types";

export function useCalendarData(userId: string) {
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
          entriesForDate.sort((a, b) => {
             if (a.type === 'available' && b.type !== 'available') return -1;
             if (a.type !== 'available' && b.type === 'available') return 1;
             if (a.type === 'available' && b.type === 'available') {
               return (a.meta as AvailabilityMeta).startTime.localeCompare((b.meta as AvailabilityMeta).startTime);
             }
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
    goToToday
  };
} 