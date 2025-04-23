import { Skeleton } from "@/components/ui/skeleton";

// Loading shimmer for calendar cells
export function CalendarShimmer() {
  // 7 days per row, typically 5-6 rows in a month view
  const rows = 6;
  const columns = 7;

  return (
    <div className="space-y-4 p-4"> {/* Added padding */} 
      {/* Month header shimmer */}
      <div className="flex justify-center mb-8"> {/* Adjusted margin */} 
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Day headers */} 
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-5 w-full" />
        ))}
      </div>

      {/* Calendar days */} 
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-2 mt-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-14 w-full rounded-lg"
            />
          ))}
        </div>
      ))}
    </div>
  );
} 