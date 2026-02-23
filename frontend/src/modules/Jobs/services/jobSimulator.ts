import type { Job } from "../types"

const timers = new Map<string, ReturnType<typeof setInterval>>()

function randomStep() {
  return Math.floor(Math.random() * 20) + 10 
}

function randomFailChance() {
  return Math.random() < 0.2 
}


export function startJobSimulation(
  job: Job,
  onUpdate: (job: Job) => void
) {
  if (timers.has(job.id)) return


  if (job.status === "pending") {
    job.status = "processing"
  }

  const timer = setInterval(() => {
 
    if (
      job.status === "completed" ||
      job.status === "failed" ||
      job.status === "cancelled"
    ) {
      stopJobSimulation(job.id)
      return
    }

    job.progress = Math.min(100, job.progress + randomStep())

    if (job.progress >= 100) {
      job.progress = 100
      job.status = randomFailChance()
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


export function cancelJob(job: Job, onUpdate: (job: Job) => void) {
  job.status = "cancelled"
  stopJobSimulation(job.id)
  onUpdate({ ...job })
}


export function retryJob(job: Job, onUpdate: (job: Job) => void) {
  job.status = "pending"
  job.progress = 0
  onUpdate({ ...job })
}