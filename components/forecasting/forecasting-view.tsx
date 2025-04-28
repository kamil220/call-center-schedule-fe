import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Loader2, InfoIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useForecastingData } from "@/hooks/use-forecasting-data"
import { groupHoursIntoBlocks } from "@/lib/forecasting"
import { HourBlock } from "./hour-block"

export function ForecastingView() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("all")
  
  const {
    data,
    isLoading,
    error,
    departments,
    staffingData
  } = useForecastingData(selectedDate, selectedDepartment)

  const hourBlocks = React.useMemo(() => 
    groupHoursIntoBlocks(staffingData), [staffingData]
  )

  if (error) {
    return (
      <Card className="col-span-2">
        <CardContent className="flex items-center justify-center h-[400px] text-destructive">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Staffing Requirements</CardTitle>
            {data?.meta.available_strategies && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {Object.entries(data.meta.available_strategies).map(([key, description]) => (
                        <div key={key} className="text-sm">
                          {description}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "dd MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  fromDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
                  toDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                />
              </PopoverContent>
            </Popover>

            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              disabled={isLoading || !data}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {data?.meta.strategy && data.meta.strategy !== 'default' && (
          <CardDescription className="mt-2">
            Strategy: {data.meta.strategy}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {hourBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="grid grid-cols-6 gap-3">
                {block.map((data) => (
                  <HourBlock
                    key={data.hour}
                    hour={data.hour}
                    departments={data.departments}
                    selectedDepartment={selectedDepartment}
                    departmentsList={departments}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 