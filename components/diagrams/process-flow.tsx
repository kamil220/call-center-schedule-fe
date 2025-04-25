import { MermaidDiagram } from '../mermaid-diagram';

const processFlowDiagram = `%%{init: {'theme':'neutral', 'themeVariables': { 'primaryColor': '#d4d0ff', 'primaryTextColor': '#323232'}}}%%
sequenceDiagram
    participant Agent
    participant TeamManager
    participant Planner
    participant System

    Note over Agent, System: Leave request flow
    Agent->>System: Submit leave request
    System->>TeamManager: Forward leave request
    TeamManager->>System: Approve/Deny leave request
    System-->>Agent: Notify leave request status
    
    Note over Agent, System: Sick leave flow
    Agent->>System: Submit sick leave
    System->>System: Auto-approve sick leave
    System->>TeamManager: Notify about sick leave
    System-->>Agent: Confirm sick leave registration
    System->>Planner: Update workforce availability
    
    Note over TeamManager, System: Schedule creation flow
    Agent->>Planner: Submit shift preferences
    TeamManager->>Planner: Submit team needs
    Planner->>System: Add special events
    Planner->>System: Request call history
    Planner->>System: Request upcoming events
    Planner->>System: Request agent skills/efficiency
    System-->>Planner: Provide call history
    System-->>Planner: Provide upcoming events
    System-->>Planner: Provide agent skills/efficiency data
    Planner->>System: Generate initial schedule
    System-->>TeamManager: Send schedule proposal
    TeamManager->>TeamManager: Review proposal
    TeamManager->>System: Add comments / approve
    System-->>Agent: Publish final schedule
    
    Note over Agent, System: Schedule adjustments
    Agent->>System: Confirm or request changes
    System->>TeamManager: Forward change requests
    TeamManager->>System: Process change requests
    System-->>Agent: Notify of request status
    
    Note over TeamManager, Planner: Handling workforce shortages
    System->>System: Detect workforce shortage
    System->>TeamManager: Alert about workforce shortage
    TeamManager->>Planner: Request schedule adjustment
    Planner->>System: Update schedule
    System->>TeamManager: Send revised schedule
    TeamManager->>System: Approve emergency changes
    System-->>Agent: Notify about schedule changes
`;

export function ProcessFlowDiagram() {
  return <MermaidDiagram chart={processFlowDiagram} />;
} 