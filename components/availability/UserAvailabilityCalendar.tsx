"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { calendarService } from "@/services/calendar.service";
import type { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Holiday } from "@/types";

type AvailabilityStatus = 'available' | 'unavailable' | 'vacation' | 'sick_leave' | 'holiday';

interface TimeSlot {
  date: Date;
  status: AvailabilityStatus;
  startTime?: string;
  endTime?: string;
  holidayName?: string;
}

interface HolidaySlot {
  date: Date;
  status: 'holiday';
  holidayName: string | null;
}

type CalendarSlot = TimeSlot | HolidaySlot;

// Mock data - replace with API call later
const mockAvailability: TimeSlot[] = [
  {
    date: new Date(2025, 3, 15), // April 15, 2025
    status: 'available',
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    date: new Date(2025, 3, 16), // April 16, 2025
    status: 'available',
    startTime: "10:00",
    endTime: "18:00",
  },
  {
    date: new Date(2025, 3, 17), // April 17, 2025
    status: 'vacation',
  },
  {
    date: new Date(2025, 3, 18), // April 18, 2025
    status: 'vacation',
  },
  {
    date: new Date(2025, 3, 19), // April 19, 2025
    status: 'sick_leave',
  },
  {
    date: new Date(2025, 3, 22), // April 22, 2025
    status: 'available',
    startTime: "12:00",
    endTime: "20:00",
  },
  {
    date: new Date(2025, 3, 23), // April 23, 2025
    status: 'unavailable',
  },
  {
    date: new Date(2025, 3, 24), // April 24, 2025
    status: 'available',
    startTime: "08:00",
    endTime: "16:00",
  },
];

const statusStyles = {
  available: "bg-green-50 hover:bg-green-100 text-green-700",
  unavailable: "bg-gray-50 hover:bg-gray-100 text-gray-500",
  vacation: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  sick_leave: "bg-red-50 hover:bg-red-100 text-red-700",
  holiday: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  default: "bg-white hover:bg-gray-50",
};

interface UserAvailabilityCalendarProps {
  userId: string;
}

export function UserAvailabilityCalendar({ userId }: UserAvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availability, setAvailability] = useState<TimeSlot[]>(mockAvailability);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("09:00");
  const [selectedEndTime, setSelectedEndTime] = useState("17:00");
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>('available');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Fetch holidays when the year changes
  useEffect(() => {
    async function fetchHolidays() {
      setIsLoadingHolidays(true);
      try {
        const holidayData = await calendarService.getHolidays(currentYear);
        console.log(`Loaded ${holidayData.length} holidays for year ${currentYear}:`, holidayData);
        setHolidays(holidayData);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      } finally {
        setIsLoadingHolidays(false);
      }
    }

    fetchHolidays();
  }, [currentYear]);

  // Check if a date is a holiday based on the API data
  const checkIfHoliday = (date: Date): HolidaySlot | null => {
    if (date.getFullYear() !== currentYear) {
      return null;
    }
    
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;
    
    // Find the matching holiday
    const holiday = holidays.find(h => h.date === formattedDate);
    
    if (holiday) {
      return {
        date,
        status: 'holiday',
        holidayName: holiday.description
      };
    }
    
    return null;
  };

  const getAvailabilityForDate = (date: Date): CalendarSlot | undefined => {
    // Check if it's a holiday first using the API data
    const holidaySlot = checkIfHoliday(date);
    if (holidaySlot) {
      return holidaySlot;
    }
    
    // Fallback to sync check during loading
    if (isLoadingHolidays && date.getFullYear() === currentYear && isCommonFixedHoliday(date)) {
      return {
        date,
        status: 'holiday',
        holidayName: getCommonHolidayName(date)
      };
    }
    
    // Check availability
    return availability.find(
      (slot) => slot.date.toDateString() === date.toDateString()
    );
  };

  const handleSaveAvailability = () => {
    if (!selectedRange?.from) return;

    const newSlots: TimeSlot[] = [];
    const currentDate = new Date(selectedRange.from);
    const endDate = selectedRange.to || selectedRange.from;

    while (currentDate <= endDate) {
      // Skip holidays
      const holidaySlot = checkIfHoliday(currentDate);
      if (!holidaySlot) {
        newSlots.push({
          date: new Date(currentDate),
          status: selectedStatus,
          ...(selectedStatus === 'available' && {
            startTime: selectedStartTime,
            endTime: selectedEndTime,
          }),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setAvailability((prev) => {
      const filtered = prev.filter(
        (slot) => !newSlots.some(newSlot => 
          newSlot.date.toDateString() === slot.date.toDateString()
        )
      );
      return [...filtered, ...newSlots];
    });

    setSelectedRange(undefined);
    setIsDialogOpen(false);
  };

  // Handle month/year navigation to load holidays for the new year
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    const year = date.getFullYear();
    if (year !== currentYear) {
      setCurrentYear(year);
    }
  };
  
  // Go to today's date in calendar
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    
    // If year changed, update it to fetch new holidays
    if (today.getFullYear() !== currentYear) {
      setCurrentYear(today.getFullYear());
    }
  };

  const calculateSummary = () => {
    const summary = {
      workingHours: 0,
      vacationDays: 0,
      sickLeaveDays: 0
    };

    availability.forEach(slot => {
      if (slot.status === 'available' && slot.startTime && slot.endTime) {
        const start = parseInt(slot.startTime.split(':')[0]);
        const end = parseInt(slot.endTime.split(':')[0]);
        summary.workingHours += end - start;
      } else if (slot.status === 'vacation') {
        summary.vacationDays += 1;
      } else if (slot.status === 'sick_leave') {
        summary.sickLeaveDays += 1;
      }
    });

    return summary;
  };

  const calculateSelectedDays = () => {
    if (!selectedRange?.from) return 0;
    if (!selectedRange.to) return 1;
    
    const diffTime = selectedRange.to.getTime() - selectedRange.from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setSelectedRange(undefined);
      return;
    }

    // Don't allow selection of holidays
    const fromHoliday = checkIfHoliday(range.from);
    if (fromHoliday) {
      return;
    }

    if (range.to) {
      const toHoliday = checkIfHoliday(range.to);
      if (toHoliday) {
        return;
      }
    }

    // If clicking the same day that's already selected as a single day, clear the selection
    if (selectedRange?.from && selectedRange?.to && 
        range?.from && range?.to &&
        selectedRange.from.toDateString() === selectedRange.to.toDateString() &&
        range.from.toDateString() === range.to.toDateString() &&
        selectedRange.from.toDateString() === range.from.toDateString()) {
      setSelectedRange(undefined);
      return;
    }
    
    // If selecting a new single day, set both from and to to the same date
    if (range?.from && !range.to) {
      setSelectedRange({ from: range.from, to: range.from });
      return;
    }

    setSelectedRange(range);
  };

  useEffect(() => {
    // TODO: Fetch user availability data using userId
    // For now using mock data
  }, [userId]);

  // Helper function to check if a date is a common fixed holiday
  // Used as a fallback when API data is loading
  const isCommonFixedHoliday = (date: Date): boolean => {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Check only major fixed holidays
    return (
      (month === 0 && day === 1) ||  // New Year
      (month === 0 && day === 6) ||  // Epiphany
      (month === 4 && day === 1) ||  // Labor Day
      (month === 4 && day === 3) ||  // Constitution Day
      (month === 7 && day === 15) || // Assumption
      (month === 10 && day === 1) || // All Saints Day
      (month === 10 && day === 11) || // Independence Day
      (month === 11 && day === 25) || // Christmas Day
      (month === 11 && day === 26)    // Second Day of Christmas
    );
  };
  
  // Helper function to get holiday name for common fixed holidays
  const getCommonHolidayName = (date: Date): string | null => {
    if (!isCommonFixedHoliday(date)) return null;
    
    const month = date.getMonth();
    const day = date.getDate();
    
    if (month === 0 && day === 1) return 'Nowy Rok';
    if (month === 0 && day === 6) return 'Święto Trzech Króli';
    if (month === 4 && day === 1) return 'Święto Pracy';
    if (month === 4 && day === 3) return 'Święto Konstytucji 3 Maja';
    if (month === 7 && day === 15) return 'Wniebowzięcie Najświętszej Maryi Panny';
    if (month === 10 && day === 1) return 'Wszystkich Świętych';
    if (month === 10 && day === 11) return 'Święto Niepodległości';
    if (month === 11 && day === 25) return 'Boże Narodzenie (pierwszy dzień)';
    if (month === 11 && day === 26) return 'Boże Narodzenie (drugi dzień)';
    
    return 'Święto';
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
      
      <Calendar
        mode="single"
        selected={selectedRange?.from}
        onSelect={(date) => {
          if (date) {
            // Don't allow selection of holidays
            const holidaySlot = checkIfHoliday(date);
            if (holidaySlot) return;
            
            setSelectedRange({ from: date, to: date });
            setIsDialogOpen(true);
          }
        }}
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
          day: "h-14 w-full p-0 font-normal aria-selected:opacity-100",
          day_selected: "bg-primary/5 hover:bg-primary/10",
          day_today: "bg-accent",
          day_hidden: "invisible",
        }}
        components={{
          DayContent: ({ date }) => {
            const slot = getAvailabilityForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const status = slot?.status || 'unavailable';
            
            const dayContent = (
              <div
                className={cn(
                  "h-14 w-full flex flex-col justify-center items-center rounded-lg transition-colors",
                  statusStyles[status],
                  isToday && "border-primary border",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                )}
              >
                <div className={cn(
                  "font-medium",
                  isToday && "text-primary"
                )}>{date.getDate()}</div>
                {status === 'available' && slot && 'startTime' in slot && 'endTime' in slot && (
                  <div className="text-[10px] font-medium mt-1">
                    {slot.startTime}-{slot.endTime}
                  </div>
                )}
                {status === 'holiday' && (
                  <div className="text-[10px] font-medium mt-1">
                    Holidays
                  </div>
                )}
              </div>
            );

            // Wrap in tooltip if it's a holiday
            if (status === 'holiday' && slot?.holidayName) {
              return (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {dayContent}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{slot.holidayName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return dayContent;
          },
        }}
      />

      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-700">Working Hours</span>
          <span className="text-2xl font-semibold text-green-700">{calculateSummary().workingHours}h</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium text-orange-700">Vacation Days</span>
          <span className="text-2xl font-semibold text-orange-700">{calculateSummary().vacationDays}d</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-red-700">Sick Leave Days</span>
          <span className="text-2xl font-semibold text-red-700">{calculateSummary().sickLeaveDays}d</span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) setSelectedRange(undefined);
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Set Availability
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={(value: AvailabilityStatus) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick_leave">Sick Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Select Date Range</label>
                {selectedRange?.from && (
                  <span className="text-sm text-muted-foreground">
                    Total: {calculateSelectedDays()} {calculateSelectedDays() === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
                disabled={(date) => date < new Date()}
                className="border rounded-md p-3"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "grid grid-cols-7 gap-2",
                  head_cell: "text-muted-foreground font-medium text-[0.8rem] text-center",
                  row: "grid grid-cols-7 gap-2 mt-2",
                  cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
                  day: "h-8 w-full p-0 font-normal aria-selected:opacity-100",
                  day_range_start: "rounded-l-md bg-primary text-primary-foreground",
                  day_range_end: "rounded-r-md bg-primary text-primary-foreground",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                }}
              />
            </div>

            {selectedStatus === 'available' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time</label>
                  <Select value={selectedStartTime} onValueChange={setSelectedStartTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Time</label>
                  <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setSelectedRange(undefined);
              setIsDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveAvailability}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 