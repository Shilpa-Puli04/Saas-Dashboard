import type { Job } from "./types"

export const jobsMock: Job[] = [
  {
    id: "1",
    name: "Import Campaign Data",
    createdAt: "2025-02-20 10:00",
    progress: 100,
    status: "completed",
  },
  {
    id: "2",
    name: "Generate Report",
    createdAt: "2025-02-20 10:05",
    progress: 70,
    status: "failed",
  },
  {
    id: "3",
    name: "Sync Assets",
    createdAt: "2025-02-20 10:10",
    progress: 100,
    status: "completed",
  },
]