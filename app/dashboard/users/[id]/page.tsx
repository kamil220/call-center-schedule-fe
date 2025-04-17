"use client";

import { UserAvailabilityCalendar } from "@/components/availability/UserAvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function UserAvailabilityPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Availability Management</h1>
      
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <Card className="p-4">
            <UserAvailabilityCalendar userId={params.id} />
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="p-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="rounded-full bg-primary/10 p-3">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Set Your Availability</h2>
                <p className="text-muted-foreground mb-6">
                  Please set your availability for the upcoming month. This helps in better scheduling and work organization.
                </p>
                <Button className="w-full" variant="default">
                  Set Monthly Schedule
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 