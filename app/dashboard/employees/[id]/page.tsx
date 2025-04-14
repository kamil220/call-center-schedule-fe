'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Employee, 
  UserRole, 
  UserStatus,
  Rating, 
  EfficiencyDetails as EfficiencyDetailsType,
  EmployeeComment
} from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { formatRoleName, formatStatus } from "@/types/user";
import {
  ArrowLeft,
  Phone,
  Mail,
  Home,
  Calendar as CalendarIcon,
  Phone as AlertPhone,
  Star,
  User,
  LineChart
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { RequireRole } from "@/components/require-role";

// Generate mock schedule data
const generateMockSchedule = () => {
  const today = new Date();
  const schedule: Record<string, string> = {};
  
  // Add shifts for next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    if (Math.random() > 0.3) { // 70% chance to have a shift
      const shift = Math.random() > 0.5 ? "Morning (8-16)" : "Evening (14-22)";
      schedule[format(date, 'yyyy-MM-dd')] = shift;
    }
  }
  
  return schedule;
};

// Mock data for employees (should be fetched from API in real app)
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@email.com',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    hireDate: '2020-01-15',
    manager: null,
    specializations: ['Management', 'IT'],
    efficiency: {
      overall: 5,
      workSpeed: 5,
      confidence: 5,
      knowledge: 5
    },
    workload: 85,
    comments: [
      {
        id: 'c1',
        authorId: '3',
        date: '2023-05-15',
        content: 'John is an excellent team leader.'
      }
    ],
    avatar: "/avatars/john.jpg",
    phoneNumber: "+48 123 456 789",
    address: "ul. Warszawska 10, 00-001 Warszawa",
    emergencyContact: "Anna Admin, +48 987 654 321",
    schedule: generateMockSchedule()
  },
  {
    id: '2',
    name: 'Sara Planner',
    email: 'planner@example.com',
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-03-22',
    manager: '1',
    specializations: ['HR', 'Management'],
    efficiency: {
      overall: 4,
      workSpeed: 4,
      confidence: 5,
      knowledge: 4
    },
    workload: 75,
    comments: [],
    avatar: "/avatars/sara.jpg",
    phoneNumber: "+48 234 567 890",
    schedule: generateMockSchedule()
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'manager@example.com',
    role: UserRole.TEAM_MANAGER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-05-10',
    manager: '1',
    specializations: ['Sales', 'Management'],
    efficiency: {
      overall: 4,
      workSpeed: 3,
      confidence: 5,
      knowledge: 4
    },
    workload: 65,
    comments: [],
    schedule: generateMockSchedule()
  },
  {
    id: '4',
    name: 'Amy Agent',
    email: 'agent@example.com',
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    hireDate: '2022-01-05',
    manager: '3',
    specializations: ['Customer Service', 'Sales'],
    efficiency: {
      overall: 3,
      workSpeed: 4,
      confidence: 3,
      knowledge: 2
    },
    workload: 95,
    comments: [],
    schedule: generateMockSchedule()
  },
  {
    id: '5',
    name: 'David Agent',
    email: 'david@example.com',
    role: UserRole.AGENT,
    status: UserStatus.INACTIVE,
    hireDate: '2022-02-15',
    manager: '3',
    specializations: ['Technical Support'],
    efficiency: {
      overall: 2,
      workSpeed: 2,
      confidence: 2,
      knowledge: 3
    },
    workload: 0,
    comments: [],
    schedule: generateMockSchedule()
  },
  {
    id: '6',
    name: 'Emma Planner',
    email: 'emma@example.com',
    role: UserRole.PLANNER,
    status: UserStatus.ACTIVE,
    hireDate: '2021-11-08',
    manager: '2',
    specializations: ['HR', 'Administration'],
    efficiency: {
      overall: 4,
      workSpeed: 3,
      confidence: 4,
      knowledge: 5
    },
    workload: 80,
    comments: [],
    schedule: generateMockSchedule()
  },
];

// Component to render star ratings
const StarRating = ({ rating }: { rating: Rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

// Component to render efficiency details
const EfficiencyDetails = ({ efficiency }: { efficiency: EfficiencyDetailsType }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Overall:</h3>
          <StarRating rating={efficiency.overall} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Work Speed:</h3>
          <StarRating rating={efficiency.workSpeed} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Confidence:</h3>
          <StarRating rating={efficiency.confidence} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Knowledge:</h3>
          <StarRating rating={efficiency.knowledge} />
        </div>
      </div>
    </div>
  );
};

// Component to render comments
const CommentsList = ({ 
  comments, 
  onAddComment 
}: { 
  comments: EmployeeComment[];
  onAddComment: (content: string) => void;
}) => {
  const [newComment, setNewComment] = useState("");
  
  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="comment">Add a note</Label>
        <Textarea
          id="comment"
          value={newComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
          placeholder="Add a note about this employee..."
          className="mt-1"
        />
        <Button 
          className="mt-2" 
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          Add Note
        </Button>
      </div>
      
      <div className="space-y-4 mt-6">
        <h3 className="font-medium text-lg">Previous Notes</h3>
        {comments.length === 0 ? (
          <p className="text-muted-foreground">No notes available.</p>
        ) : (
          comments.map((comment) => {
            const author = mockEmployees.find(emp => emp.id === comment.authorId);
            return (
              <Card key={comment.id}>
                <CardHeader className="py-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{author?.name || 'Unknown'}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(comment.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  {comment.content}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

interface CalendarDayProps {
  date: Date;
  onClick?: () => void;
  selected?: boolean;
  today?: boolean;
}

// Employee Schedule display
const ScheduleCalendar = ({ schedule }: { schedule: Record<string, string> }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDayShift, setSelectedDayShift] = useState<string | null>(null);
  
  useEffect(() => {
    if (date) {
      const dateKey = format(date, 'yyyy-MM-dd');
      setSelectedDayShift(schedule[dateKey] || null);
    } else {
      setSelectedDayShift(null);
    }
  }, [date, schedule]);
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          // Custom day renderer to show shift markers
          components={{
            Day: (props: CalendarDayProps) => {
              const dateKey = format(props.date, 'yyyy-MM-dd');
              const hasShift = schedule[dateKey];
              return (
                <div 
                  onClick={() => props.onClick?.()}
                  className={`
                    relative p-3 cursor-pointer flex items-center justify-center
                    ${props.selected ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground' : ''}
                    ${props.today ? 'border border-primary' : ''}
                  `}
                >
                  <time dateTime={format(props.date, 'yyyy-MM-dd')}>
                    {format(props.date, 'd')}
                  </time>
                  {hasShift && (
                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${props.selected ? 'bg-primary-foreground' : 'bg-primary'}`}></div>
                  )}
                </div>
              );
            }
          }}
        />
      </div>
      <div className="flex-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{date ? format(date, 'EEEE, MMM d, yyyy') : '-'}</CardTitle>
            <CardDescription>
              {selectedDayShift 
                ? `Scheduled shift: ${selectedDayShift}` 
                : 'No shift scheduled for this day'}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total shifts this month:</span>
                <span className="font-medium">{Object.keys(schedule).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Upcoming shifts:</span>
                <span className="font-medium">
                  {Object.entries(schedule).filter(([date]) => 
                    new Date(date) >= new Date()).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple stat component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> 
}) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

interface EmployeeStats {
  averageHandlingTime: string;
  firstContactResolution: string;
  customerSatisfaction: string;
  callsHandled: number;
}

// Mock statistics generator
const generateEmployeeStats = (): EmployeeStats => {
  return {
    averageHandlingTime: `${(Math.random() * 5 + 3).toFixed(2)} min`,
    firstContactResolution: `${(Math.random() * 30 + 70).toFixed(1)}%`,
    customerSatisfaction: `${(Math.random() * 1 + 4).toFixed(1)}/5`,
    callsHandled: Math.floor(Math.random() * 1000 + 500),
  };
};

export default function EmployeeProfile() {
  const params = useParams();
  const employeeId = params.id as string;
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  
  useEffect(() => {
    // In a real app, fetch employee data from API
    const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
    
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setStats(generateEmployeeStats());
    }
    
    setLoading(false);
  }, [employeeId]);
  
  // Add a comment
  const handleAddComment = (content: string) => {
    if (employee) {
      const newComment: EmployeeComment = {
        id: `c${Math.random().toString().substring(2, 10)}`,
        authorId: '1', // Current user ID (admin in this mock)
        date: format(new Date(), 'yyyy-MM-dd'),
        content
      };
      
      setEmployee({
        ...employee,
        comments: [newComment, ...employee.comments]
      });
    }
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading employee data...</div>;
  }
  
  if (!employee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Employee not found</h2>
        <Button onClick={() => router.push('/dashboard/employees')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>
    );
  }
  
  return (
    <RequireRole requiredRole={UserRole.TEAM_MANAGER}>
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/employees')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardContent className="flex flex-col md:flex-row gap-6 p-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback>{employee.name.charAt(0)}{employee.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 flex-1">
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{formatRoleName(employee.role)}</p>
                
                <div className="flex items-center mt-2 space-x-1">
                  <Badge 
                    variant={employee.status === 'ACTIVE' ? "default" : "destructive"}
                    className={employee.status === 'ACTIVE' ? "bg-green-500" : ""}
                  >
                    {formatStatus(employee.status)}
                  </Badge>
                  
                  {employee.specializations.map(spec => (
                    <Badge key={spec} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  
                  {employee.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.phoneNumber}</span>
                    </div>
                  )}
                  
                  {employee.address && (
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                  </div>
                  
                  {employee.emergencyContact && (
                    <div className="flex items-center">
                      <AlertPhone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Emergency: {employee.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Efficiency Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <EfficiencyDetails efficiency={employee.efficiency} />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Employee Schedule</CardTitle>
                <CardDescription>View and manage work schedule</CardDescription>
              </CardHeader>
              <CardContent>
                {employee.schedule ? (
                  <ScheduleCalendar schedule={employee.schedule} />
                ) : (
                  <p>No schedule information available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      title="Average Handling Time" 
                      value={stats.averageHandlingTime} 
                      icon={CalendarIcon} 
                    />
                    <StatCard 
                      title="First Contact Resolution" 
                      value={stats.firstContactResolution} 
                      icon={User} 
                    />
                    <StatCard 
                      title="Customer Satisfaction" 
                      value={stats.customerSatisfaction} 
                      icon={Star} 
                    />
                    <StatCard 
                      title="Calls Handled" 
                      value={stats.callsHandled} 
                      icon={Phone} 
                    />
                  </div>
                ) : (
                  <p>No statistics available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes & Comments</CardTitle>
                <CardDescription>Add notes and view feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <CommentsList 
                  comments={employee.comments} 
                  onAddComment={handleAddComment} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireRole>
  );
} 