import { jobsMock } from "../mock"
import type { Job } from "../types"

const STORAGE_KEY = "jobs-data"

let interval: number | null = null


export function loadJobs(): Job[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    saveJobs(jobsMock)
    return jobsMock
  }

  try {
    return JSON.parse(raw)
  } catch {
    saveJobs(jobsMock)
    return jobsMock
  }
}

export function saveJobs(jobs: Job[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}


function randomStep() {
  return Math.floor(Math.random() * 20) + 10
}

function randomFail() {
  return Math.random() < 0.2
}



export function startJobSimulation(
  onUpdate: (jobs: Job[]) => void
) {
  if (interval) return

 
  const stored = loadJobs()
  jobsMock.splice(0, jobsMock.length, ...stored)

  interval = window.setInterval(() => {
    jobsMock.forEach((j) => {
      if (
        j.status === "completed" ||
        j.status === "failed" ||
        j.status === "cancelled"
      )
        return

      if (j.status === "pending") {
        j.status = "processing"
      }

      if (j.status === "processing") {
        j.progress = Math.min(
          100,
          (j.progress ?? 0) + randomStep()
        )

        if (j.progress >= 100) {
          j.status = randomFail()
            ? "failed"
            : "completed"
        }
      }
    })

    saveJobs(jobsMock)
    onUpdate([...jobsMock])
  }, 1000)
}

export function stopJobSimulation() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}



export function retryJob(id: string) {
  const jobs = loadJobs()
  const job = jobs.find((j) => j.id === id)
  if (!job) return

  job.status = "pending"
  job.progress = 0

  saveJobs(jobs)
}

export function cancelJob(id: string) {
  const jobs = loadJobs()
  const job = jobs.find((j) => j.id === id)
  if (!job) return

  if (
    job.status === "completed" ||
    job.status === "failed"
  )
    return

  job.status = "cancelled"
  saveJobs(jobs)
}


export function getJobs(): Job[] {
  return loadJobs()
}