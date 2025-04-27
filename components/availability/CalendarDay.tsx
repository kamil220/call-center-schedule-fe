import { cn } from "@/lib/utils";
import type { Holiday, ScheduleEntry, AvailabilityMeta, LeaveMeta } from "@/types/calendar.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

// Simplified status styles for DayContent background
const statusStyles = {
  available: "bg-green-50 hover:bg-green-100 text-green-700",
  leave: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700", 
  leavePending: "bg-[#FFE4B5] hover:bg-[#FFE4B5]/80 text-yellow-800",
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

  let dayStatus: 'available' | 'leave' | 'leavePending' | 'holiday' | 'unavailable' = 'unavailable';
  let content = null;
  let tooltipContent: string | null = null;
  let isPending = false;
  const customStyle: React.CSSProperties = {};

  if (holiday) {
    dayStatus = 'holiday';
    tooltipContent = holiday.description;
    content = <div className="text-[10px] font-medium mt-1">Holiday</div>;
  } else if (entries.length > 0) {
     const leaveEntry = entries.find(e => e.type === 'leave');
     if (leaveEntry) {
        const meta = leaveEntry.meta as LeaveMeta;
        if (meta.status === 'pending') {
          dayStatus = 'leavePending';
          isPending = true;
          customStyle.backgroundColor = undefined;
        } else {
          dayStatus = 'leave';
          if (meta.color) {
            customStyle.backgroundColor = meta.color;
            customStyle.color = "#333";
          }
        }
        content = (
          <div className={cn(
            "text-[10px] font-medium mt-1",
            meta.status === 'pending' ? 'text-yellow-800' : ''
          )}>
            {meta.leaveTypeLabel}
          </div>
        );
        tooltipContent = `${meta.leaveTypeLabel}${meta.reason ? `: ${meta.reason}` : ''} (${meta.status})`;
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
    "h-14 w-full flex flex-col justify-center items-center rounded-lg transition-colors cursor-pointer relative",
    statusStyles[dayStatus] || statusStyles.default,
    isToday && "ring-2 ring-primary ring-offset-1",
    isOutsideMonth && "opacity-40 pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
  );

  const dayElement = (
    <div className={dayClasses} style={customStyle}>
      <div className={cn(
        "text-sm font-medium", 
        isToday && "font-bold",
        dayStatus === 'leavePending' && "text-yellow-800"
      )}>
        {date.getDate()}
      </div>
      {content}
      {isPending && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -top-1 right-1">
                <Clock className="h-3.5 w-3.5 text-yellow-800/70 fill-white" strokeWidth={2.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="text-xs">
              Pending approval
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
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