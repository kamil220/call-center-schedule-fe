import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TimeInput({ value, onChange, error }: TimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Basic time format validation (HH:mm)
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  return (
    <Input
      type="time"
      value={value}
      onChange={handleChange}
      className={cn(
        "w-32",
        error && "border-destructive focus-visible:ring-destructive"
      )}
    />
  );
} 