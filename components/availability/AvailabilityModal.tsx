import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { AvailabilityForm } from "@/components/availability/AvailabilityForm";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
}

type FormType = "availability" | "leave";
type Step = 1 | 2;

export function AvailabilityModal({ isOpen, onClose, selectedDate }: AvailabilityModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [formType, setFormType] = useState<FormType | null>(null);

  const handleTypeSelect = (type: FormType) => {
    setFormType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setFormType(null);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">What would you like to do?</h2>
        <p className="text-muted-foreground">
          {selectedDate && `Selected date: ${format(selectedDate, "MMMM d, yyyy")}`}
        </p>
      </div>
      
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
      return <AvailabilityForm selectedDate={selectedDate} onClose={onClose} />;
    }
    return <div>Leave request form (coming soon)</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 1 ? (
          renderStep1()
        ) : (
          <div>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              ← Back
            </Button>
            {renderStep2()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 