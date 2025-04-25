import { MermaidDiagram } from '../mermaid-diagram';

const contextMapDiagram = `%%{init: {'theme':'neutral', 'themeVariables': { 'primaryColor': '#d4d0ff', 'primaryTextColor': '#323232'}}}%%
flowchart TB
    %% Bounded Contexts
    EMP[Employee Management] --- |provides data| SCH[Schedule Planning]
    EMP --- |provides skills| QUEUE[Call Channels]
    QUEUE --- |feeds| PRED[Traffic Prediction]
    QUEUE --- |defines requirements| SCH
    PRED --- |forecasts guide| SCH
    SCH --- |results populate| KPI[KPI Monitoring]
    KPI --- |informs| SCH
    
    %% Context descriptions
    subgraph "Employee Management"
        EMP1[Employee profiles]
        EMP2[Skills management]
        EMP3[Availability/preferences]
        EMP4[Leave requests]
    end
    
    subgraph "Call Channels"
        Q1[Queue configuration]
        Q2[SLA parameters]
        Q3[Handling rules]
    end
    
    subgraph "Traffic Prediction"
        P1[Forecasting models]
        P2[Historical patterns]
        P3[Special events]
    end
    
    subgraph "Schedule Planning"
        S1[Schedule creation]
        S2[Optimization]
        S3[Shift management]
        S4[Business rules]
    end
    
    subgraph "KPI Monitoring"
        K1[Metrics tracking]
        K2[Service level analysis]
        K3[Cost assessment]
    end
    
    %% Relationship types
    classDef customer fill:#f9f,stroke:#333
    classDef supplier fill:#bbf,stroke:#333
    classDef partnership fill:#bfb,stroke:#333
    
    class EMP,QUEUE partnership
    class PRED supplier
    class SCH customer
    class KPI supplier`;

export function ContextMapDiagram() {
  return <MermaidDiagram chart={contextMapDiagram} />;
} 