// Types
export interface CallDetails {
  id: string;
  dateTime: string;
  line: string;
  phoneNumber: string;
  operator: string;
  duration: string;
  tags: string[];
  notes: string[];
  transcription: string;
  audioUrl: string;
}

// Mock data - replace with actual API calls in production
const mockCallData: CallDetails[] = [
  {
    id: "1",
    dateTime: "2024-03-20 14:30:00",
    line: "Sales",
    phoneNumber: "+48 123 456 789",
    operator: "Jack Davis",
    duration: "00:52:30",
    tags: ["Basic medical package", "Follow-up required"],
    notes: [
      "Customer inquired about extending their medical package",
      "Needs follow-up next week",
      "Interested in family plan options"
    ],
    transcription: `
Operator: Thank you for calling Telemedi, this is Jack speaking. How may I help you today?
Customer: Hi, I'd like to know more about extending my medical package.
Operator: I'd be happy to help you with that. Could you please confirm your current package type?
Customer: Yes, I have the basic medical package.
Operator: Thank you for confirming that. I can see that your current package includes basic consultations and preventive care. Would you be interested in learning about our premium package options?
Customer: Yes, please. What additional benefits would I get?
[...]`,
    audioUrl: "/sample-call-recording.mp3"
  },
  {
    id: "2",
    dateTime: "2024-03-20 13:15:00",
    line: "Customer Service",
    phoneNumber: "+48 987 654 321",
    operator: "Emma Wilson",
    duration: "00:15:45",
    tags: ["Premium package", "Resolved"],
    notes: [
      "Technical issue with video consultation",
      "Problem resolved - browser cache cleared",
    ],
    transcription: `
Operator: Thank you for calling Telemedi support, this is Emma. How can I assist you today?
Customer: Hi, I'm having trouble with my video consultation. The screen keeps freezing.
[...]`,
    audioUrl: "/calls/call-2.mp3"
  }
];

class CallService {
  // Get all calls
  async getCalls(): Promise<CallDetails[]> {
    // In production, this would be an API call
    return mockCallData;
  }

  // Get a specific call by ID
  async getCallById(id: string): Promise<CallDetails | null> {
    // In production, this would be an API call
    const call = mockCallData.find(call => call.id === id);
    return call || null;
  }

  // Add a note to a call
  async addNote(callId: string, note: string): Promise<boolean> {
    // In production, this would be an API call
    const call = mockCallData.find(call => call.id === callId);
    if (call) {
      call.notes.push(note);
      return true;
    }
    return false;
  }

  // Update call tags
  async updateTags(callId: string, tags: string[]): Promise<boolean> {
    // In production, this would be an API call
    const call = mockCallData.find(call => call.id === callId);
    if (call) {
      call.tags = tags;
      return true;
    }
    return false;
  }
}

export const callService = new CallService(); 