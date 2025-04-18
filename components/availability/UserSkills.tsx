"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSkill, SkillCategory } from "@/types/users/domain.types";
import { Award, Star, StarOff } from "lucide-react";

interface UserSkillsProps {
  skills: UserSkill[];
}

const categoryLabels = {
  [SkillCategory.SALES]: "Sales",
  [SkillCategory.CUSTOMER_SERVICE]: "Customer Service",
  [SkillCategory.TECHNICAL]: "Technical",
  [SkillCategory.ADMIN]: "Administration",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {star <= rating ? (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

export function UserSkills({ skills }: UserSkillsProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce<Record<SkillCategory, UserSkill[]>>(
    (acc, skill) => {
      const category = skill.skillTag.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<SkillCategory, UserSkill[]>
  );

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="rounded-full bg-primary/10 p-3">
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Skills & Training</h2>
          <ScrollArea className="h-[200px] w-full pr-4">
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, categorySkills], index, array) => (
                <div key={category}>
                  <h3 className="text-sm text-muted-foreground mb-2">
                    {categoryLabels[category as SkillCategory]}
                  </h3>
                  <div className="space-y-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.skillTag.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{skill.skillTag.name}</span>
                        <StarRating rating={skill.rating} />
                      </div>
                    ))}
                  </div>
                  {index < array.length - 1 && (
                    <div className="mt-3 border-t border-border/40" />
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