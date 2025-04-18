"use client";

import { Card } from "@/components/ui/card";
import { EmploymentType, type EmploymentDetails } from "@/types/users/domain.types";
import { BriefcaseIcon } from "lucide-react";

interface EmploymentInfoProps {
  employmentDetails: EmploymentDetails;
  firstName: string;
  lastName: string;
}

export function EmploymentInfo({ employmentDetails, firstName, lastName }: EmploymentInfoProps) {
  const { type, vacationDays, vacationDaysUsed } = employmentDetails;

  const getEmploymentTypeLabel = (type: EmploymentType): string => {
    switch (type) {
      case EmploymentType.UOP:
        return "Employment Agreement";
      case EmploymentType.B2B:
        return "Contract B2B";
      case EmploymentType.UZ:
        return "Employment Contract";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="rounded-full bg-primary/10 p-3">
            <BriefcaseIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Name: <span className="font-medium text-foreground">{firstName} {lastName}</span>
            </p>
            <p className="text-muted-foreground">
              Type: <span className="font-medium text-foreground">{getEmploymentTypeLabel(type)}</span>
            </p>
            {type === EmploymentType.UOP && vacationDays !== undefined && vacationDaysUsed !== undefined && (
              <p className="text-muted-foreground">
                Vacation Days: <span className="font-medium text-foreground">{vacationDays - vacationDaysUsed} remaining</span>
                <span className="text-sm"> (used {vacationDaysUsed} of {vacationDays})</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 