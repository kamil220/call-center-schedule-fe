"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EvaluationEntry } from "@/types/users/domain.types";
import { format } from "date-fns";
import { Star, StarHalf, StarOff, ClipboardCheck } from "lucide-react";

interface UserEvaluationProps {
  evaluations: EvaluationEntry[];
}

const criteriaLabels = {
  managerRating: "Manager Rating",
  customerSatisfaction: "Customer Satisfaction",
  confidence: "Confidence",
  knowledge: "Knowledge",
  experience: "Experience",
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    } else if (i - 0.5 === rating) {
      stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<StarOff key={i} className="h-4 w-4 text-gray-300" />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
}

export function UserEvaluation({ evaluations }: UserEvaluationProps) {
  // Sort evaluations by date, newest first
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="rounded-full bg-primary/10 p-3">
            <ClipboardCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Evaluations</h2>
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="space-y-8">
              {sortedEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium">
                        Evaluator: {evaluation.evaluator}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(evaluation.date), "d MMMM yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(evaluation.criteria).map(([key, rating]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">
                          {criteriaLabels[key as keyof typeof criteriaLabels]}:
                        </span>
                        <StarRating rating={rating} />
                      </div>
                    ))}
                  </div>

                  {evaluation.note && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-1">Note:</div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {evaluation.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
} 