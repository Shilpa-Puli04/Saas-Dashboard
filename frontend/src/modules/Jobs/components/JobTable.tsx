import type { Job } from "../types"
import { getJobProgress } from "./jobProgress"

type Props = {
  jobs: Job[]
  retryJob: (id: string) => void
  cancelJob: (id: string) => void
}

const statusStyles: Record<Job["status"], string> = {
  pending: "bg-slate-100 text-slate-700",
  processing: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
  cancelled: "bg-slate-200 text-slate-600",
}

export default function JobTable({
  jobs,
  retryJob,
  cancelJob,
}: Props) {
  return (
    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Job</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Progress</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => {
            const progress = getJobProgress(j)

            return (
              <tr
                key={j.id}
                className="border-b border-slate-100 hover:bg-slate-50/60 transition"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {j.name}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {j.createdAt}
                </td>

                <td className="px-4 py-3 w-72">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[j.status]}`}
                  >
                    {j.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  {j.status === "failed" && (
                    <button
                      onClick={() => retryJob(j.id)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Retry
                    </button>
                  )}

                  {j.status === "processing" && (
                    <button
                      onClick={() => cancelJob(j.id)}
                      className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}

                  {j.status !== "failed" &&
                    j.status !== "processing" && (
                      <span className="text-slate-400">
                        —
                      </span>
                    )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}