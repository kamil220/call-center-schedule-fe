import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ApiUser } from '@/types';
import { SkillPath } from '@/types/calls';
import { usersApi, skillPathsApi } from '@/services/api';
import { toast } from 'sonner';

interface FiltersProps {
  onFilterChange: (filters: {
    operatorId: string | null;
    lineId: string | null;
    skillPathId: number | null;
    search: string;
  }) => void;
  showOperatorFilter?: boolean;
}

export function Filters({ onFilterChange, showOperatorFilter = true }: FiltersProps) {
  const [operators, setOperators] = useState<ApiUser[]>([]);
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedSkillPath, setSelectedSkillPath] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isLoadingOperators, setIsLoadingOperators] = useState(true);
  const [isLoadingSkillPaths, setIsLoadingSkillPaths] = useState(true);

  useEffect(() => {
    if (showOperatorFilter) {
      loadOperators();
    }
    loadSkillPaths();
  }, [showOperatorFilter]);

  useEffect(() => {
    onFilterChange({
      operatorId: selectedOperator,
      lineId: null,
      skillPathId: selectedSkillPath ? Number(selectedSkillPath) : null,
      search,
    });
  }, [selectedOperator, selectedSkillPath, search, onFilterChange]);

  const loadOperators = async () => {
    try {
      setIsLoadingOperators(true);
      const response = await usersApi.getUsers();
      const activeOperators = response.items.filter(user => user.active);
      setOperators(activeOperators);
    } catch (error) {
      console.error('Failed to load operators:', error);
      toast.error("Failed to load operators");
    } finally {
      setIsLoadingOperators(false);
    }
  };

  const loadSkillPaths = async () => {
    try {
      setIsLoadingSkillPaths(true);
      const data = await skillPathsApi.getSkillPaths();
      setSkillPaths(data);
    } catch (error) {
      console.error('Failed to load skill paths:', error);
      toast.error("Failed to load skill paths");
    } finally {
      setIsLoadingSkillPaths(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {showOperatorFilter && (
        <Select
          value={selectedOperator || "all"}
          onValueChange={(value) => setSelectedOperator(value === "all" ? null : value)}
          disabled={isLoadingOperators}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All operators</SelectItem>
            {operators.map((operator) => (
              <SelectItem key={operator.id} value={operator.id}>
                {operator.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={selectedSkillPath || "all"}
        onValueChange={(value) => setSelectedSkillPath(value === "all" ? null : value)}
        disabled={isLoadingSkillPaths}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select line path" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All lines</SelectItem>
          {skillPaths.map((skillPath) => (
            <SelectItem key={skillPath.id} value={skillPath.id.toString()}>
              {skillPath.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search by phone number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-[200px]"
      />
    </div>
  );
} 