"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

interface RecurringScheduleProps {
  userId: string;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SCHEDULE: WeeklySchedule = DAYS_OF_WEEK.reduce((acc, day) => ({
  ...acc,
  [day]: {
    enabled: false,
    startTime: "09:00",
    endTime: "17:00",
  },
}), {});

export function RecurringSchedule({ userId }: RecurringScheduleProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleToggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (day: string, type: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Save to API
    console.log("Saving schedule:", schedule);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-end mb-8">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="space-y-6">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day}>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <Switch
                  checked={schedule[day].enabled}
                  onCheckedChange={() => handleToggleDay(day)}
                />
                <Label className="text-lg">{day}</Label>
              </div>

              {schedule[day].enabled && (
                <div className="flex items-center gap-4">
                  <Select
                    value={schedule[day].startTime}
                    onValueChange={(value) => handleTimeChange(day, "startTime", value)}
                  >
                    <SelectTrigger className="w-[100px]">
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

                  <span className="text-muted-foreground">to</span>

                  <Select
                    value={schedule[day].endTime}
                    onValueChange={(value) => handleTimeChange(day, "endTime", value)}
                  >
                    <SelectTrigger className="w-[100px]">
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
              )}
            </div>
            {index < DAYS_OF_WEEK.length - 1 && (
              <Separator className="mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 