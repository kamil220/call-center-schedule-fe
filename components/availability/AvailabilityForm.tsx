import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeInput } from "@/components/ui/time-input";
import { PlusCircle, Trash2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfToday, parse, isWithinInterval } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
  error?: string;
}

interface AvailabilityFormProps {
  selectedDate: Date | undefined;
  onClose: () => void;
}

export function AvailabilityForm({ selectedDate, onClose }: AvailabilityFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: selectedDate,
    to: selectedDate,
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { start: "09:00", end: "17:00" },
  ]);

  const parseTimeToDate = (timeString: string) => {
    return parse(timeString, "HH:mm", new Date());
  };

  const validateTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    return slots.map((slot, index) => {
      const startTime = parseTimeToDate(slot.start);
      const endTime = parseTimeToDate(slot.end);

      // Check if end time is before start time
      if (isBefore(endTime, startTime)) {
        return { ...slot, error: "End time cannot be before start time" };
      }

      // Check for overlaps with other slots
      const hasOverlap = slots.some((otherSlot, otherIndex) => {
        if (index === otherIndex) return false;

        const otherStart = parseTimeToDate(otherSlot.start);
        const otherEnd = parseTimeToDate(otherSlot.end);

        return (
          isWithinInterval(startTime, { start: otherStart, end: otherEnd }) ||
          isWithinInterval(endTime, { start: otherStart, end: otherEnd }) ||
          isWithinInterval(otherStart, { start: startTime, end: endTime })
        );
      });

      if (hasOverlap) {
        return { ...slot, error: "Time slots cannot overlap" };
      }

      return { ...slot, error: undefined };
    });
  };

  const addTimeSlot = () => {
    if (timeSlots.length < 2) {
      const newSlot = { start: "09:00", end: "17:00" };
      setTimeSlots([...timeSlots, newSlot]);
    }
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  const handleSubmit = () => {
    // Validate date range
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Invalid date range", {
        description: "Please select a date range"
      });
      return;
    }

    // Validate time slots
    const validatedSlots = validateTimeSlots(timeSlots);
    const hasErrors = validatedSlots.some(slot => slot.error);
    
    if (hasErrors) {
      setTimeSlots(validatedSlots); // Update UI to show errors
      toast.error("Invalid time slots", {
        description: "Please fix the overlapping time slots before saving"
      });
      return;
    }
    
    // TODO: Handle form submission
    console.log({ dateRange, timeSlots });
    toast.success("Availability saved successfully");
    onClose();
  };

  const today = startOfToday();
  
  const disabledDays = {
    before: today
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Set Your Availability</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Note: If availability is already set for the selected date(s), it will be overwritten with the new schedule.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Select Date Range</h3>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedDate && isBefore(selectedDate, today) ? today : selectedDate}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={disabledDays}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Time Slots</h3>
              {timeSlots.length < 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Time Slot
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <TimeInput
                      value={slot.start}
                      onChange={(value) => updateTimeSlot(index, "start", value)}
                      error={slot.error}
                    />
                    <span className="text-muted-foreground">to</span>
                    <TimeInput
                      value={slot.end}
                      onChange={(value) => updateTimeSlot(index, "end", value)}
                      error={slot.error}
                    />
                    {timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  {slot.error && (
                    <p className="text-sm text-destructive">{slot.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSubmit}
        >
          Save Availability
        </Button>
      </div>
    </div>
  );
} 