import { useEffect, useState } from "react"
import type { Job } from "../types"
import { loadJobs, saveJobs } from "../services/jobService"

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** Load */
  useEffect(() => {
    try {
      const data = loadJobs()
      setJobs(data)
    } catch {
      setError("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }, [])

  /** Persist whenever jobs change */
  useEffect(() => {
    if (!loading) saveJobs(jobs)
  }, [jobs, loading])

  /** Simulate lifecycle polling */
  useEffect(() => {
    const timer = setInterval(() => {
      setJobs((prev) =>
        prev.map((j) => {
          if (j.status === "pending")
            return { ...j, status: "processing" }

          if (j.status === "processing") {
            return {
              ...j,
              status: Math.random() > 0.3 ? "completed" : "failed",
            }
          }

          return j
        })
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  function retryJob(id: string) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: "pending" } : j
      )
    )
  }

  function cancelJob(id: string) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: "cancelled" } : j
      )
    )
  }

  return {
    jobs,
    loading,
    error,
    retryJob,
    cancelJob,
  }
}