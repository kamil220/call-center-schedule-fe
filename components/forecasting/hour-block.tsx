import * as React from "react"
import { cn } from "@/lib/utils"

interface HourBlockProps {
  hour: number
  departments: Record<string, number>
  selectedDepartment: string
  departmentsList: string[]
}

export function HourBlock({ hour, departments, selectedDepartment, departmentsList }: HourBlockProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3",
        "hover:border-primary/50 transition-colors"
      )}
    >
      <div className="text-sm font-medium mb-2 text-muted-foreground">
        {String(hour).padStart(2, '0')}:00
      </div>
      {selectedDepartment === "all" ? (
        <div className="space-y-1.5">
          {departmentsList.map((dept) => (
            <div key={dept} className="group flex items-center justify-between">
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[70%]">
                {dept}
              </span>
              <span className={cn(
                "text-sm font-medium",
                departments[dept] > 0 ? "text-foreground" : "text-muted-foreground"
              )}>
                {departments[dept]}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className={cn(
            "text-2xl font-bold",
            departments[selectedDepartment] > 0 ? "text-foreground" : "text-muted-foreground"
          )}>
            {departments[selectedDepartment]}
          </span>
        </div>
      )}
    </div>
  )
} 