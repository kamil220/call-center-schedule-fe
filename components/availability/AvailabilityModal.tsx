"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { AvailabilityForm } from "./AvailabilityForm";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { ApiEmploymentType } from "@/types";

type Step = 1 | 2;
type FormType = "availability" | "leave";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  employmentType: ApiEmploymentType;
}

export function AvailabilityModal({ isOpen, onClose, selectedDate, employmentType }: AvailabilityModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [formType, setFormType] = useState<FormType | null>(null);

  const handleClose = () => {
    setStep(1);
    setFormType(null);
    onClose();
  };

  const handleTypeSelect = (type: FormType) => {
    setFormType(type);
    setStep(2);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleTypeSelect("availability")}
        >
          <div className="text-center space-y-4">
            <CalendarRange className="w-12 h-12 mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Set Availability</h3>
            <p className="text-sm text-muted-foreground">
              Define your working hours and availability
            </p>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleTypeSelect("leave")}
        >
          <div className="text-center space-y-4">
            <CalendarRange className="w-12 h-12 mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Leave Request</h3>
            <p className="text-sm text-muted-foreground">
              Submit a request for time off
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (formType === "availability") {
      return <AvailabilityForm selectedDate={selectedDate} onClose={handleClose} />;
    }
    return <LeaveRequestForm 
      selectedDate={selectedDate} 
      employmentType={employmentType}
      onClose={handleClose} 
    />;
  };

  const getDialogTitle = () => {
    if (step === 1) {
      return "Select Action Type";
    }
    return formType === "availability" ? "Set Availability" : "Leave Request";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {step === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
} 