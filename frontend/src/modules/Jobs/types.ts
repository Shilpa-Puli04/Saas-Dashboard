export type JobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"

export type Job = {
  id: string
  name: string
  createdAt: string
  progress: number
  status: JobStatus
}