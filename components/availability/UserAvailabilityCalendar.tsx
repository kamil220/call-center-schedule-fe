"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarShimmer } from "@/components/availability/CalendarShimmer";
import { CalendarDay } from "@/components/availability/CalendarDay";
import { CalendarSummary } from "@/components/availability/CalendarSummary";
import { useCalendarData } from "@/hooks/useCalendarData";
import { formatDateForApi } from "@/lib/calendarUtils";
import { useState } from "react";
import { AvailabilityModal } from "@/components/availability/AvailabilityModal";

interface UserAvailabilityCalendarProps {
  userId: string;
}

export function UserAvailabilityCalendar({ userId }: UserAvailabilityCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    selectedRange,
    setSelectedRange,
    scheduleEntries,
    holidays,
    isLoadingHolidays,
    isLoadingAvailability,
    currentMonth,
    findHolidayForDate,
    handleMonthChange,
    goToToday
  } = useCalendarData(userId);

  const handleDateSelectForDialog = (date: Date | undefined) => {
    if (!date) return;

    const publicHoliday = findHolidayForDate(date);
    if (publicHoliday) return;

    setSelectedRange({ from: date, to: date });
    setIsModalOpen(true);
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
          mode="single"
          selected={selectedRange?.from}
          onSelect={handleDateSelectForDialog}
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
            day_selected: "",
            day_today: "",
            day_hidden: "invisible",
          }}
          components={{
            DayContent: ({ date }) => {
              const dateKey = formatDateForApi(date);
              const entries = scheduleEntries.get(dateKey) || [];
              const publicHoliday = findHolidayForDate(date);

              return (
                <CalendarDay
                  date={date}
                  currentMonth={currentMonth}
                  entries={entries}
                  holiday={publicHoliday}
                />
              );
            },
          }}
        />
      )}

      <CalendarSummary
        isLoading={isLoadingAvailability}
        scheduleEntries={scheduleEntries}
        holidays={holidays}
        currentMonth={currentMonth}
      />

      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedRange?.from}
      />
    </div>
  );
} 