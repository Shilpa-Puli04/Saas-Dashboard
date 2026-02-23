import type { Job } from "../types"

const timers = new Map<string, ReturnType<typeof setInterval>>()

function randomStep() {
  return Math.floor(Math.random() * 20) + 10
}

function randomFail() {
  return Math.random() < 0.2
}

export function startJobSimulation(
  job: Job,
  onUpdate: (job: Job) => void
) {
  if (timers.has(job.id)) return

  // pending → processing
  if (job.status === "pending") {
    job.status = "processing"
    job.progress = 10
    onUpdate({ ...job })
  }

  if (job.status !== "processing") return

  const timer = setInterval(() => {
    if (job.status !== "processing") {
      stopJobSimulation(job.id)
      return
    }

    job.progress = Math.min(95, job.progress + randomStep())

    if (job.progress >= 95) {
      job.progress = 100
      job.status = randomFail()
        ? "failed"
        : "completed"
      stopJobSimulation(job.id)
    }

    onUpdate({ ...job })
  }, 1200)

  timers.set(job.id, timer)
}

export function stopJobSimulation(id: string) {
  const t = timers.get(id)
  if (t) {
    clearInterval(t)
    timers.delete(id)
  }
}

export function retryJobService(
  job: Job,
  onUpdate: (job: Job) => void
) {
  job.status = "pending"
  job.progress = 0
  onUpdate({ ...job })
}

export function cancelJobService(
  job: Job,
  onUpdate: (job: Job) => void
) {
  job.status = "cancelled"
  stopJobSimulation(job.id)
  onUpdate({ ...job })
}