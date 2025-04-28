import { callsApi } from '@/services/api';
import { Call, CallDetails, GetCallsParams, GetCallsResponse } from '@/types/calls';

// Mock data for features not yet implemented in backend
const mockCallDetails = (call: Call): CallDetails => ({
  ...call,
  tags: ['important', 'follow-up'],
  notes: [
    {
      id: '1',
      content: 'Patient requested follow-up call',
      createdAt: '2024-03-20T10:00:00Z',
      createdBy: {
        id: '1',
        name: 'John Doe'
      }
    }
  ],
  transcription: 'This is a mock transcription of the call...',
  audioUrl: 'https://example.com/audio/123.mp3'
});

export const callService = {
  getCalls: async (params?: GetCallsParams): Promise<GetCallsResponse> => {
    return callsApi.getCalls(params);
  },

  getCallDetails: async (id: number): Promise<CallDetails> => {
    const call = await callsApi.getCall(id);
    return mockCallDetails(call);
  }
}; 