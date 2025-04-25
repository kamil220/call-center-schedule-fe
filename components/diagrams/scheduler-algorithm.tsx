import { MermaidDiagram } from '../mermaid-diagram';

const schedulerAlgorithmDiagram = `%%{init: {'theme':'neutral', 'themeVariables': { 'primaryColor': '#d4d0ff', 'primaryTextColor': '#323232'}}}%%
flowchart TD
    START[Start scheduling process] --> COLLECT[Collect input data]

    subgraph Input Data Collection
        COLLECT --> HISTORY[Get historical call volumes]
        COLLECT --> EVENTS[Get upcoming special events]
        COLLECT --> PREFS[Get agent shift preferences]
        COLLECT --> SKILLS[Get agent skills/efficiency data]
        COLLECT --> LEAVES[Get approved leaves/sick leaves]
        COLLECT --> NEEDS[Get team staffing requirements]
    end

    subgraph Forecast Generation
        HISTORY --> ANALYZE[Analyze historical patterns]
        EVENTS --> ESTIMATE[Estimate impact of special events]
        ANALYZE --> BASELINE[Generate baseline forecast]
        ESTIMATE --> ADJUST[Adjust forecast based on events]
        BASELINE --> ADJUST
        ADJUST --> FINAL_FORECAST[Final call volume forecast]
    end

    subgraph Staff Requirements
        FINAL_FORECAST --> CALC_STAFF[Calculate required staff per hour]
        CALC_STAFF --> BY_SKILL[Distribute by required skill sets]
        BY_SKILL --> STAFF_NEEDS[Final staffing requirements]
    end

    subgraph Schedule Optimization
        STAFF_NEEDS --> OPTIMIZE[Run optimization algorithm]
        PREFS --> OPTIMIZE
        SKILLS --> OPTIMIZE
        NEEDS --> OPTIMIZE
        LEAVES --> OPTIMIZE
        OPTIMIZE --> CONSTRAINTS[Apply business constraints]
        CONSTRAINTS --> SHIFTS[Generate initial shifts]
    end

    subgraph Schedule Refinement
        SHIFTS --> CHECK_COVERAGE[Check coverage gaps]
        CHECK_COVERAGE --> GAP{Coverage gaps?}
        GAP -->|Yes| REALLOCATE[Reallocate resources]
        REALLOCATE --> CHECK_COVERAGE
        GAP -->|No| BALANCE[Balance workload]
        BALANCE --> CHECK_FAIRNESS[Check schedule fairness]
        CHECK_FAIRNESS --> FAIR{Fair to all agents?}
        FAIR -->|No| ADJUST_FAIRNESS[Make fairness adjustments]
        ADJUST_FAIRNESS --> CHECK_FAIRNESS
        FAIR -->|Yes| FINAL_SCHEDULE[Final schedule draft]
    end

    FINAL_SCHEDULE --> PUBLISH[Send to TeamManager for review]
    PUBLISH --> END[End scheduling process]

    %% Connections between subgraphs
    Input_Data_Collection --> Forecast_Generation
    Forecast_Generation --> Staff_Requirements
    Staff_Requirements --> Schedule_Optimization
    Schedule_Optimization --> Schedule_Refinement

    %% Special case - emergency rescheduling
    EMERGENCY[Emergency staffing shortage detected] -->|Trigger| PRIORITY[Prioritize queues/tasks]
    PRIORITY --> CRITICAL[Identify critical services]
    CRITICAL --> REASSIGN[Reassign available agents]
    REASSIGN --> NOTIFY[Notify affected agents]
    NOTIFY --> MONITOR[Monitor service levels]

    style EMERGENCY fill:#FF9999
    style PRIORITY fill:#FF9999
    style CRITICAL fill:#FF9999
    style REASSIGN fill:#FF9999
    style NOTIFY fill:#FF9999
    style MONITOR fill:#FF9999
`;

export function SchedulerAlgorithmDiagram() {
  return <MermaidDiagram chart={schedulerAlgorithmDiagram} />;
} 