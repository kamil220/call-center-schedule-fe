"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAvailableLeaveTypes } from "@/hooks/useAvailableLeaveTypes";
import { ApiEmploymentType, ApiLeaveType } from "@/types";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { format, isBefore, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { leaveRequestsService } from "@/services/leave-requests.service";

interface LeaveRequestFormProps {
  selectedDate?: Date;
  employmentType: ApiEmploymentType;
  onClose: () => void;
  userId?: string;
}

export function LeaveRequestForm({ selectedDate, employmentType, onClose, userId }: LeaveRequestFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: selectedDate,
    to: selectedDate,
  });
  const [leaveType, setLeaveType] = useState<ApiLeaveType | undefined>();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { leaveTypes } = useAvailableLeaveTypes(employmentType);
  const today = startOfToday();

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to || !leaveType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await leaveRequestsService.create({
        type: leaveType,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
        reason: comment || undefined,
        userId: userId,
      });
      
      toast.success("Leave request submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Submit Leave Request</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select the type of leave and the date range for your request.
        </p>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Leave Type</Label>
            <Select
              value={leaveType}
              onValueChange={(value) => setLeaveType(value as ApiLeaveType)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Select Date Range</Label>
            <div className="grid gap-2 mt-2">
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
                    disabled={{ before: today }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Comment</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any additional information..."
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
} 