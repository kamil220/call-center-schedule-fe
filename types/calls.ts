// API Types
export interface Line {
  id: number;
  name: string;
}

export interface SkillPath {
  id: number;
  name: string;
}

export interface Operator {
  id: string;
  fullName: string;
  email: string;
}

export interface Call {
  id: number;
  dateTime: string;
  skillPath: SkillPath;
  line: Line;
  phoneNumber: string;
  operator: Operator;
  duration: number; // duration in seconds
}

export interface GetCallsResponse {
  items: Call[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCallsParams {
  page?: number;
  limit?: number;
  operatorId?: string;
  lineId?: number;
  skillPathId?: number;
  phoneNumber?: string;
  sortBy?: keyof Call;
  direction?: 'asc' | 'desc';
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

// Extended call details including mocked data
export interface CallDetails extends Call {
  tags: string[];
  notes: Note[];
  transcription: string;
  audioUrl: string;
} 