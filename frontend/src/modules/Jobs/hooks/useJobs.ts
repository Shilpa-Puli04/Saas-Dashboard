import { useEffect, useState } from "react"
import { jobsMock } from "../mock"
import type { Job } from "../types"
import {
  startJobSimulation,
  retryJobService,
  cancelJobService,
} from "../services/jobSimulator"

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setJobs(jobsMock)
      setLoading(false)
    } catch (e: any) {
      setError("Failed to load jobs")
      setLoading(false)
    }
  }, [])

  // start simulation for active jobs
  useEffect(() => {
    jobs.forEach((job) => {
      if (job.status === "pending" || job.status === "processing") {
        startJobSimulation(job, (updated) => {
          setJobs((prev) =>
            prev.map((j) =>
              j.id === updated.id ? updated : j
            )
          )
        })
      }
    })
  }, [jobs])

  function retryJob(id: string) {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j
        retryJobService(j, updateJob)
        return { ...j }
      })
    )
  }

  function cancelJob(id: string) {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j
        cancelJobService(j, updateJob)
        return { ...j }
      })
    )
  }

  function updateJob(updated: Job) {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === updated.id ? updated : j
      )
    )
  }

  return { jobs, loading, error, retryJob, cancelJob }
}