import * as React from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { workScheduleApi } from "@/services/api"
import type { ForecastData } from "@/types/forecasting"

interface UseForecastingDataReturn {
  data: ForecastData | null
  isLoading: boolean
  error: string | null
  departments: string[]
  staffingData: Array<{
    hour: number
    departments: Record<string, number>
  }>
}

export function useForecastingData(
  selectedDate: Date,
  selectedDepartment: string
): UseForecastingDataReturn {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<ForecastData | null>(null)

  // Fetch data when date changes
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
        const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd')
        const result = await workScheduleApi.getForecasts(start, end)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedDate])

  // Get unique departments from the data
  const departments = React.useMemo(() => {
    if (!data?.data) return []
    const deptSet = new Set<string>()
    Object.values(data.data).forEach((dailyForecast) => {
      Object.keys(dailyForecast).forEach((dept) => deptSet.add(dept))
    })
    return Array.from(deptSet)
  }, [data])

  // Get forecast data for selected date and department(s)
  const staffingData = React.useMemo(() => {
    if (!data?.data) return []
    
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const dailyData = data.data[dateStr] || {}
    
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      departments: {} as Record<string, number>
    }))

    const departsToShow = selectedDepartment === "all" 
      ? departments 
      : [selectedDepartment]

    departsToShow.forEach(dept => {
      const deptData = dailyData[dept]?.hours || {}
      hours.forEach(hourData => {
        hourData.departments[dept] = deptData[hourData.hour.toString()]?.required_employees || 0
      })
    })

    return hours
  }, [data, selectedDate, selectedDepartment, departments])

  return {
    data,
    isLoading,
    error,
    departments,
    staffingData
  }
} 