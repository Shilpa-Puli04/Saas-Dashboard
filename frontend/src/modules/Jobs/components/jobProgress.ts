import type { Job } from "../types"

export function getJobProgress(j: Job) {
  switch (j.status) {
    case "pending":
      return 0
    case "processing":
      return j.progress
    case "completed":
      return 100
    case "failed":
      return 100
    case "cancelled":
      return 0
    default:
      return j.progress
  }
}