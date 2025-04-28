'use client'
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ForecastingView } from "@/components/forecasting/forecasting-view"

import data from "./data.json"

// Example forecasting data - replace with actual API call
const forecastingData = {
  "data": {
    "2025-05-01": {
      "Administration": {
        "hours": {
          "6": {
            "required_employees": 2,
            "metadata": {}
          },
          "7": {
            "required_employees": 3,
            "metadata": {}
          }
        }
      },
      "Customer Service": {
        "hours": {
          "6": {
            "required_employees": 1,
            "metadata": {}
          }
        }
      }
    }
  },
  "meta": {
    "start_date": "2025-05-01",
    "end_date": "2025-05-20",
    "strategy": "default",
    "available_strategies": {
      "historical_analysis": "Forecasts demand based on historical call data analysis"
    }
  }
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <ForecastingView data={forecastingData} />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
