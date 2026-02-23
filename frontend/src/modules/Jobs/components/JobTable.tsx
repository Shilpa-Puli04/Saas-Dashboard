import type { Job } from "../types"

type Props = {
  jobs: Job[]
  retryJob: (id: string) => void
  cancelJob: (id: string) => void
}

const statusStyles: Record<Job["status"], string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-600", 
}

export default function JobTable({
  jobs,
  retryJob,
  cancelJob,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left">
            <th className="p-3">Job</th>
            <th className="p-3">Created</th>
            <th className="p-3">Progress</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-b">
              <td className="p-3 font-medium">{j.name}</td>

              <td className="p-3">{j.createdAt}</td>

              <td className="p-3 w-64">
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${j.progress}%` }}
                  />
                </div>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${statusStyles[j.status]}`}
                >
                  {j.status}
                </span>
              </td>

              <td className="p-3 text-right space-x-2">
                {j.status === "failed" && (
                  <button
                    onClick={() => retryJob(j.id)}
                    className="text-blue-600 text-sm"
                  >
                    Retry
                  </button>
                )}

                {j.status === "processing" && (
                  <button
                    onClick={() => cancelJob(j.id)}
                    className="text-red-600 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}