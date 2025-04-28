export interface HourlyRequirement {
  required_employees: number;
  metadata: Record<string, any>;
}

export interface DepartmentHours {
  hours: {
    [hour: string]: HourlyRequirement;
  };
}

export interface DailyForecast {
  [department: string]: DepartmentHours;
}

export interface ForecastData {
  data: {
    [date: string]: DailyForecast;
  };
  meta: {
    start_date: string;
    end_date: string;
    strategy: string;
    available_strategies: {
      [key: string]: string;
    };
  };
} 