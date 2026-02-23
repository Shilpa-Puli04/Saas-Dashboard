import JobTable from "../components/JobTable"
import { useJobs } from "../hooks/useJobs"
import type { Job } from "../types"
import { useState } from "react"

type StatusFilter = "all" | Job["status"]

export default function JobListPage() {
  const { jobs, loading, error, retryJob, cancelJob } = useJobs()
  const [filter, setFilter] = useState<StatusFilter>("all")

  if (loading) {
    return <div>Loading jobs...</div>
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-3">
          Failed to load jobs
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  const filtered =
    filter === "all"
      ? jobs
      : jobs.filter((j) => j.status === filter)

  const counts: Record<Job["status"], number> = {
    pending: jobs.filter((j) => j.status === "pending")
      .length,
    processing: jobs.filter(
      (j) => j.status === "processing"
    ).length,
    completed: jobs.filter(
      (j) => j.status === "completed"
    ).length,
    failed: jobs.filter((j) => j.status === "failed")
      .length,
    cancelled: jobs.filter(
      (j) => j.status === "cancelled"
    ).length,
  }

  const filters: StatusFilter[] = [
    "all",
    "pending",
    "processing",
    "completed",
    "failed",
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Jobs
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {filters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 text-sm rounded border ${
              filter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            {labelWithCount(s, counts)}
          </button>
        ))}
      </div>

      <JobTable
        jobs={filtered}
        retryJob={retryJob}
        cancelJob={cancelJob}
      />
    </div>
  )
}

function labelWithCount(
  s: StatusFilter,
  counts: Record<Job["status"], number>
) {
  if (s === "all") return "All"
  return `${capitalize(s)} (${counts[s]})`
}

function capitalize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1)
}