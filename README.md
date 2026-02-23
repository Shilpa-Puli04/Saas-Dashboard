
# SaaS Campaign & Job Management Dashboard

A production-grade frontend SaaS dashboard built with React, TypeScript, and Vite that simulates enterprise campaign management and asynchronous job lifecycle processing without a backend.

This project demonstrates scalable frontend architecture, modular domain design, optimistic UI patterns, persistence strategies, and clean simulation of backend workflows.

---

## Overview

The application models two core SaaS domains:

- Campaign Management — creation, filtering, editing, and asset handling  
- Background Job Processing — lifecycle simulation of asynchronous tasks  

The system reflects how real SaaS marketing or ad-tech platforms manage campaigns and their processing pipelines.

---

## Features

### Campaign List
- Debounced search
- Multi-status filtering
- Column sorting
- Pagination
- Row and bulk pause actions
- Optimistic updates with undo
- Loading, empty, and error states

### Campaign Detail
Tabbed interface:
- Overview — editable campaign data with validation and unsaved change warning
- Assets — drag-and-drop upload simulation with progress and persistence
- Performance — KPI metrics and 7-day trend charts

### Assets System
- Drag-and-drop or file picker upload
- Upload progress simulation
- Remove with confirmation
- Persistent per-campaign storage
- Cross-navigation retention

### Performance Analytics
- Impressions, Clicks, CTR metrics
- Trend visualization
- Derived KPI calculations
- Loading, empty, and error states

### Job Simulation Engine
Lifecycle simulation:

Pending → Processing → Completed / Failed / Cancelled

Capabilities:
- Background polling loop
- Randomized progress increments
- Failure probability
- Retry and Cancel actions
- Status filtering and counts
- Persistent state

---

## Architecture

Feature-based modular architecture:

src/
  modules/
    Campaign/
      components/
      pages/
      services/
      hooks/
      types/
    Jobs/
      components/
      hooks/
      services/
      types/

Principles applied:
- Separation of UI and business logic
- Service-layer simulation abstraction
- Domain-driven modules
- Typed models
- Controlled state mutation
- Persistence isolation

---

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Recharts
- LocalStorage persistence

---

## Simulation Strategy

Since no backend APIs are provided, the app simulates:

- Campaign dataset
- Job queue lifecycle
- Upload processing
- Async state transitions

Simulation responsibilities are isolated in services to keep UI declarative and testable.

---

## Persistence Model

Assets and jobs persist via browser storage:

campaign_assets:
{
  "campaignId": Asset[]
}

jobs_data:
Job[]

Ensures:
- Reload persistence
- Navigation retention
- Entity isolation

---

## Job Engine Logic

Simulation loop:
- Pending → Processing
- Progress increments randomly
- At 100%:
  - 20% → Failed
  - 80% → Completed
- Cancel → terminal state
- Retry → lifecycle reset

Terminal states always force progress = 100 for consistency.

---

## Assessment Requirements Coverage

Campaign Management UI — Complete  
Asset Upload and Persistence — Complete  
Performance Analytics — Complete  
Job Lifecycle Simulation — Complete  
Polling Abstraction — Complete  
State Persistence — Complete  
Filters, Search, Pagination — Complete  
Optimistic Updates and Undo — Complete  
Modular Architecture — Complete  

---

## Run Locally

npm install  
npm run dev  

App runs at:  
http://localhost:5173  

---

## Future Enhancements

- Backend API integration
- Job–campaign linkage
- Server pagination
- Role permissions
- WebSocket job updates
- Asset previews and reordering

---

## Author
Shilpa  
Frontend Engineer


