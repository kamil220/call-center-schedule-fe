"use client";

import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { WeeklyScheduleEntry, WorkLine } from "@/types/users/domain.types";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addWeeks, subWeeks, startOfWeek, format, addDays } from "date-fns";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeeklyScheduleProps {
  schedule: WeeklyScheduleEntry[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SHORT_DAYS = ["MON.", "TUE.", "WED.", "THU.", "FRI.", "SAT.", "SUN."];

const workLineColors = {
  [WorkLine.CUSTOMER_SERVICE]: "bg-blue-100 border-blue-200 shadow-sm hover:bg-blue-150 hover:border-blue-300 transition-colors duration-200 cursor-pointer",
  [WorkLine.SALES]: "bg-green-100 border-green-200 shadow-sm hover:bg-green-150 hover:border-green-300 transition-colors duration-200 cursor-pointer",
  [WorkLine.TECHNICAL]: "bg-purple-100 border-purple-200 shadow-sm hover:bg-purple-150 hover:border-purple-300 transition-colors duration-200 cursor-pointer",
  [WorkLine.ADMIN]: "bg-orange-100 border-orange-200 shadow-sm hover:bg-orange-150 hover:border-orange-300 transition-colors duration-200 cursor-pointer",
  [WorkLine.SUPPORT]: "bg-pink-100 border-pink-200 shadow-sm hover:bg-pink-150 hover:border-pink-300 transition-colors duration-200 cursor-pointer",
};

const workLineLabels = {
  [WorkLine.CUSTOMER_SERVICE]: "Customer Service",
  [WorkLine.SALES]: "Sales",
  [WorkLine.TECHNICAL]: "Technical",
  [WorkLine.ADMIN]: "Admin",
  [WorkLine.SUPPORT]: "Support",
};

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToCurrentHour = () => {
    const viewport = document.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    if (viewport) {
      const currentHour = new Date().getHours();
      viewport.scrollTop = currentHour * 48 - 12;
    }
  };

  useEffect(() => {
    setTimeout(scrollToCurrentHour, 100);
  }, []);

  const canGoBack = true;
  const canGoForward = addWeeks(currentDate, 3) > new Date();

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    if (canGoForward) {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  // Update the function to check if a schedule entry belongs to the current week
  const isScheduleEntryInCurrentWeek = (entry: WeeklyScheduleEntry) => {
    const entryDate = new Date(entry.date);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    return entryDate >= weekStart && entryDate <= weekEnd;
  };

  // Update scheduleBlocks to use dates instead of dayOfWeek
  const scheduleBlocks = schedule
    .filter(isScheduleEntryInCurrentWeek)
    .reduce<Record<number, Record<WorkLine, WeeklyScheduleEntry[]>>>(
      (acc, entry) => {
        // Get the day index (0-6) from the entry's date
        const entryDate = new Date(entry.date);
        const dayIndex = entryDate.getDay();
        // Convert Sunday (0) to 7 to match our calendar display
        const adjustedDayIndex = dayIndex === 0 ? 7 : dayIndex;

        if (!acc[adjustedDayIndex]) {
          acc[adjustedDayIndex] = {} as Record<WorkLine, WeeklyScheduleEntry[]>;
        }
        if (!acc[adjustedDayIndex][entry.workLine]) {
          acc[adjustedDayIndex][entry.workLine] = [];
        }
        acc[adjustedDayIndex][entry.workLine].push(entry);
        return acc;
      },
      {}
    );

  const getWorkBlockStyle = (entries: WeeklyScheduleEntry[]) => {
    const startHour = Math.min(...entries.map(e => parseInt(e.startTime.split(":")[0])));
    const endHour = Math.max(...entries.map(e => parseInt(e.endTime.split(":")[0])));
    const startMinutes = parseInt(entries[0].startTime.split(":")[1]);
    const endMinutes = parseInt(entries[0].endTime.split(":")[1]);
    
    return {
      top: `${startHour * 48 + (startMinutes / 60) * 48}px`,
      height: `${(endHour - startHour) * 48 + ((endMinutes - startMinutes) / 60) * 48}px`,
      position: "absolute" as const,
      left: "0px",
      right: "0px",
      zIndex: "10",
    };
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const isWeekend = (index: number) => index >= 5; // 5 and 6 are Saturday and Sunday

  return (
    <Card className="p-6 shadow-md">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Weekly Schedule</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousWeek}
              disabled={!canGoBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {format(startOfCurrentWeek, "MMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMM d, yyyy")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextWeek}
              disabled={!canGoForward}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Days header - sticky */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-[1px] bg-gray-100 sticky top-0 z-20">
            <div className="bg-gray-50 p-2 border-b border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={scrollToCurrentHour}
                className="w-full"
              >
                Now
              </Button>
            </div>
            {weekDays.map((day, index) => {
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return (
                <div
                  key={day.toString()}
                  className={`bg-white p-2 text-center border-b border-gray-100 
                    ${isToday ? "bg-blue-50 border border-blue-200" : ""}
                    ${isWeekend(index) ? "bg-gray-50" : ""}`}
                >
                  <div className={`font-medium text-sm ${isWeekend(index) ? "text-gray-500" : "text-gray-600"}`}>
                    {SHORT_DAYS[index]}
                  </div>
                  <div className={`text-lg ${isToday ? "text-blue-600 font-medium" : isWeekend(index) ? "text-gray-500" : ""}`}>
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scrollable time grid */}
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-[1px] bg-gray-100" ref={scrollContainerRef}>
              {/* Hours column */}
              <div className="col-start-1 col-span-1 sticky left-0 bg-gray-50 z-10">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    data-hour={hour}
                    className="h-12 pr-4 flex items-center justify-end text-sm font-medium text-gray-600 border-r border-gray-100"
                  >
                    {formatHour(hour)}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className={`bg-white relative ${isWeekend(dayIndex) ? "bg-gray-50/30" : ""}`}>
                  <div className="absolute inset-0">
                    {/* Grid lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={`${dayIndex}-${hour}-line`}
                        className={`border-t border-gray-100 h-12 ${hour % 2 === 0 ? 'bg-gray-50/50' : isWeekend(dayIndex) ? 'bg-gray-50/30' : 'bg-white'}`}
                      />
                    ))}
                  </div>

                  {/* Current time indicator */}
                  {format(weekDays[dayIndex], "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
                    <div 
                      className="absolute w-full h-0.5 bg-red-500 z-30"
                      style={{ 
                        top: `${new Date().getHours() * 48 + (new Date().getMinutes() / 60) * 48}px`,
                      }}
                    />
                  )}

                  {/* Schedule blocks */}
                  {scheduleBlocks[dayIndex + 1] && Object.entries(scheduleBlocks[dayIndex + 1]).map(([workLine, entries]) => {
                    const firstEntry = entries[0];
                    return (
                      <div
                        key={`${dayIndex}-${workLine}`}
                        className={`border rounded-sm ${workLineColors[firstEntry.workLine]} relative mr-2`}
                        style={getWorkBlockStyle(entries)}
                      >
                        <div className="flex flex-col items-start h-full p-2">
                          <div className="text-sm font-semibold text-gray-800 mb-0.5">
                            {workLineLabels[firstEntry.workLine]}
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            {formatTime(firstEntry.startTime)}-{formatTime(firstEntry.endTime)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
} 