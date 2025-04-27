import { cn } from "@/lib/utils";
import type { Holiday, ScheduleEntry, AvailabilityMeta, LeaveMeta } from "@/types/calendar.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Simplified status styles for DayContent background
const statusStyles = {
  available: "bg-green-50 hover:bg-green-100 text-green-700",
  leave: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700", 
  holiday: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  unavailable: "bg-gray-50 hover:bg-gray-100 text-gray-500",
  default: "bg-white hover:bg-gray-50",
};

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  entries: ScheduleEntry[];
  holiday: Holiday | null;
}

export function CalendarDay({ date, currentMonth, entries, holiday }: CalendarDayProps) {
  const isToday = date.toDateString() === new Date().toDateString();
  const isOutsideMonth = date.getMonth() !== currentMonth.getMonth();

  let dayStatus: 'available' | 'leave' | 'holiday' | 'unavailable' = 'unavailable';
  let content = null;
  let tooltipContent: string | null = null;
  const customStyle: React.CSSProperties = {};

  if (holiday) {
    dayStatus = 'holiday';
    tooltipContent = holiday.description;
    content = <div className="text-[10px] font-medium mt-1">Holiday</div>;
  } else if (entries.length > 0) {
     const leaveEntry = entries.find(e => e.type === 'leave');
     if (leaveEntry) {
        dayStatus = 'leave';
        const meta = leaveEntry.meta as LeaveMeta;
        content = <div className="text-[10px] font-medium mt-1">{meta.leaveTypeLabel}</div>;
        tooltipContent = meta.reason;
        if (meta.color) {
           customStyle.backgroundColor = meta.color;
           customStyle.color = "#333";
        }
     } else {
        dayStatus = 'available';
        const availableEntries = entries.filter(e => e.type === 'available') as (ScheduleEntry & { meta: AvailabilityMeta })[];
        content = availableEntries.map(entry => (
          <div key={entry.meta.id} className="text-[10px] font-medium mt-0.5 leading-tight"> 
            {entry.meta.startTime}-{entry.meta.endTime}
          </div>
        ));
     }
  }
  
  const dayClasses = cn(
    "h-14 w-full flex flex-col justify-center items-center rounded-lg transition-colors cursor-pointer",
    statusStyles[dayStatus] || statusStyles.default,
    isToday && "ring-2 ring-primary ring-offset-1",
    isOutsideMonth && "opacity-40 pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
  );

  const dayElement = (
    <div className={dayClasses} style={customStyle}>
      <div className={cn("text-sm font-medium", isToday && "font-bold")}>
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
} 