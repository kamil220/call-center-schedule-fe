"use client";

import { UserAvailabilityCalendar } from "@/components/availability/UserAvailabilityCalendar";
import { EmploymentInfo } from "@/components/availability/EmploymentInfo";
import { LeaveRequests } from "@/components/availability/LeaveRequests";
import { WeeklySchedule } from "@/components/availability/WeeklySchedule";
import { UserSkills } from "@/components/availability/UserSkills";
import { UserEvaluation } from "@/components/availability/UserEvaluation";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { EmploymentType, WorkLine, SkillCategory, LeaveRequestStatus, Rating } from "@/types/users/domain.types";
import { SiteHeader } from "@/components/site-header";

// Mock data - replace with API calls later
const mockEmploymentDetails = {
  type: EmploymentType.B2B,
  requiredHours: 160,
  vacationDays: 26,
  vacationDaysUsed: 12,
};

const mockUserData = {
  firstName: "John",
  lastName: "Smith",
};

const mockLeaveRequests = [
  {
    id: "1",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
    type: "vacation" as const,
    status: LeaveRequestStatus.APPROVED,
    comment: "Annual leave",
    responseComment: "Approved",
    respondedBy: "John Smith",
    respondedAt: "2024-03-15",
  },
  {
    id: "2",
    startDate: "2024-05-15",
    endDate: "2024-05-15",
    type: "sick_leave" as const,
    status: LeaveRequestStatus.PENDING,
    comment: "Doctor's appointment",
  },
];

const mockWeeklySchedule = [
  {
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    workLine: WorkLine.CUSTOMER_SERVICE,
    date: "2025-04-01", // Monday
  },
  {
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "16:00",
    workLine: WorkLine.SALES,
    date: "2025-04-02", // Tuesday
  },
  {
    dayOfWeek: 3,
    startTime: "10:00",
    endTime: "18:00",
    workLine: WorkLine.TECHNICAL,
    date: "2025-04-03", // Wednesday
  },
  {
    dayOfWeek: 4,
    startTime: "09:00",
    endTime: "17:00",
    workLine: WorkLine.CUSTOMER_SERVICE,
    date: "2025-04-04", // Thursday
  },
  {
    dayOfWeek: 5,
    startTime: "08:00",
    endTime: "12:00",
    workLine: WorkLine.SALES,
    date: "2025-04-05", // Friday
  },
  {
    dayOfWeek: 6,
    startTime: "12:00",
    endTime: "18:00",
    workLine: WorkLine.TECHNICAL,
    date: "2025-04-05", // Saturday
  },
  
  // Next week
  {
    dayOfWeek: 1,
    startTime: "10:00",
    endTime: "18:00",
    workLine: WorkLine.TECHNICAL,
    date: "2025-04-08", // Monday next week
  },
  {
    dayOfWeek: 2,
    startTime: "09:00",
    endTime: "17:00",
    workLine: WorkLine.CUSTOMER_SERVICE,
    date: "2024-05-09", // Tuesday next week
  },
];

const mockSkills = [
  {
    skillTag: {
      id: "1",
      name: "Basic Customer Service",
      category: SkillCategory.CUSTOMER_SERVICE,
    },
    rating: 5 as Rating,
  },
  {
    skillTag: {
      id: "2",
      name: "Complaint Resolution",
      category: SkillCategory.CUSTOMER_SERVICE,
    },
    rating: 4 as Rating,
  },
  {
    skillTag: {
      id: "3",
      name: "Phone Support",
      category: SkillCategory.CUSTOMER_SERVICE,
    },
    rating: 3 as Rating,
  },
  {
    skillTag: {
      id: "4",
      name: "Medical Products Sales",
      category: SkillCategory.SALES,
    },
    rating: 4 as Rating,
  },
  {
    skillTag: {
      id: "5",
      name: "Lead Generation",
      category: SkillCategory.SALES,
    },
    rating: 3 as Rating,
  },
  {
    skillTag: {
      id: "6",
      name: "Contract Negotiation",
      category: SkillCategory.SALES,
    },
    rating: 2 as Rating,
  },
  {
    skillTag: {
      id: "7",
      name: "CRM Systems",
      category: SkillCategory.TECHNICAL,
    },
    rating: 5 as Rating,
  },
  {
    skillTag: {
      id: "8",
      name: "Technical Documentation",
      category: SkillCategory.TECHNICAL,
    },
    rating: 3 as Rating,
  },
  {
    skillTag: {
      id: "9",
      name: "Data Analysis",
      category: SkillCategory.TECHNICAL,
    },
    rating: 4 as Rating,
  },
  {
    skillTag: {
      id: "10",
      name: "Project Management",
      category: SkillCategory.ADMIN,
    },
    rating: 4 as Rating,
  },
  {
    skillTag: {
      id: "11",
      name: "Team Coordination",
      category: SkillCategory.ADMIN,
    },
    rating: 5 as Rating,
  }
];

const mockEvaluations = [
  {
    id: "1",
    date: "2024-03-01",
    evaluator: "John Smith",
    criteria: {
      managerRating: 4 as Rating,
      customerSatisfaction: 5 as Rating,
      confidence: 4 as Rating,
      knowledge: 4 as Rating,
      experience: 3 as Rating,
    },
    note: "Excellent progress in customer service. Notable improvement in sales call confidence.",
  },
  {
    id: "2",
    date: "2024-02-01",
    evaluator: "Anna White",
    criteria: {
      managerRating: 3 as Rating,
      customerSatisfaction: 4 as Rating,
      confidence: 3 as Rating,
      knowledge: 4 as Rating,
      experience: 3 as Rating,
    },
    note: "Good product knowledge. Needs more work on confidence in challenging situations.",
  },
];

export default function UserAvailabilityPage({ params }: { params: { id: string } }) {
  const [employmentDetails] = useState(mockEmploymentDetails);
  const [leaveRequests] = useState(mockLeaveRequests);
  const [weeklySchedule] = useState(mockWeeklySchedule);
  const [skills] = useState(mockSkills);
  const [evaluations] = useState(mockEvaluations);

  useEffect(() => {
    // TODO: Fetch all data from API
    // For now using mock data
  }, [params.id]);

  return (
    <>
      <SiteHeader title="Employee Profile" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">            
            <div className="px-6">
              <div className="grid grid-cols-12 gap-6">
                {/* Left column - Calendar and Weekly Schedule */}
                <div className="col-span-7 space-y-6">
                  <Card className="p-4">
                    <UserAvailabilityCalendar userId={params.id} />
                  </Card>
                  <WeeklySchedule schedule={weeklySchedule} />
                </div>

                {/* Right column - Employment Info, Leave Requests, Skills, and Evaluation */}
                <div className="col-span-5 space-y-6">
                  <EmploymentInfo 
                    employmentDetails={employmentDetails} 
                    firstName={mockUserData.firstName}
                    lastName={mockUserData.lastName}
                  />
                  <LeaveRequests requests={leaveRequests} />
                  <UserSkills skills={skills} />
                  <UserEvaluation evaluations={evaluations} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 