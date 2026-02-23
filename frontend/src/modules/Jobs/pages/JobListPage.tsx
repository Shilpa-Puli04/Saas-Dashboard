import JobTable from "../components/JobTable"
import { useJobs } from "../hooks/useJobs"
import type { Job } from "../types"
import { useState } from "react"

export default function JobListPage() {
  const { jobs, loading, error, retryJob, cancelJob } = useJobs()

  const [statusFilter, setStatusFilter] = useState<Job["status"][]>([])

  const filters: Job["status"][] = [
    "pending",
    "processing",
    "completed",
    "failed",
  ]

  function toggleStatusFilter(s: Job["status"]) {
    setStatusFilter((prev) =>
      prev.includes(s)
        ? prev.filter((x) => x !== s)
        : [...prev, s]
    )
  }

  const filtered =
    statusFilter.length === 0
      ? jobs
      : jobs.filter((j) => statusFilter.includes(j.status))

  const counts: Record<Job["status"], number> = {
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
    cancelled: jobs.filter((j) => j.status === "cancelled").length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Background processing activity
          </p>
        </div>

        <div className="bg-white/70 border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Jobs
        </h1>

        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-rose-600 font-medium mb-3">
            Failed to load jobs
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Jobs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track background processing and execution status
        </p>
      </div>

      {/* Filters */}
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl" />

        <div className="relative bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">

            {/* All */}
            <button
              onClick={() => setStatusFilter([])}
              className={`px-3.5 py-1.5 text-sm rounded-full border transition ${
                statusFilter.length === 0
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
              }`}
            >
              All ({jobs.length})
            </button>

            {/* Status */}
            {filters.map((s) => {
              const active = statusFilter.includes(s)
              return (
                <button
                  key={s}
                  onClick={() => toggleStatusFilter(s)}
                  className={`px-3.5 py-1.5 text-sm rounded-full border capitalize transition ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {s} ({counts[s]})
                </button>
              )
            })}

            {/* Clear */}
            {statusFilter.length > 0 && (
              <button
                onClick={() => setStatusFilter([])}
                className="ml-2 px-3.5 py-1.5 text-sm rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl" />

        <div className="relative border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <JobTable
            jobs={filtered}
            retryJob={retryJob}
            cancelJob={cancelJob}
          />
        </div>
      </div>
    </div>
  )
}