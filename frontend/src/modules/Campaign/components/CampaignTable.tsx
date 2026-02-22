import { Link } from "react-router-dom"
import type { Campaign } from "../types"

type Props = {
  data: Campaign[]
  onSort: (key: "name" | "budget") => void
  sortKey: "name" | "budget" | null
  sortDir: "asc" | "desc"
  selected: string[]
  onToggleOne: (id: string) => void
  onToggleAll: (ids: string[]) => void
  onRowPause: (id: string) => void
}

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string
  column: "name" | "budget"
  sortKey: "name" | "budget" | null
  sortDir: "asc" | "desc"
  onSort: (key: "name" | "budget") => void
}) {
  const active = sortKey === column
  let icon = "⇅"
  if (active) icon = sortDir === "asc" ? "▲" : "▼"

  return (
    <th
      className="p-3 font-semibold cursor-pointer select-none hover:text-blue-600"
      onClick={() => onSort(column)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span
          className={`text-xs ${
            active ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {icon}
        </span>
      </span>
    </th>
  )
}

export default function CampaignTable({
  data,
  onSort,
  sortKey,
  sortDir,
  selected,
  onToggleOne,
  onToggleAll,
  onRowPause,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left">
            {/* Select all */}
            <th className="p-3">
              <input
                type="checkbox"
                checked={data.length > 0 && selected.length === data.length}
                onChange={() => onToggleAll(data.map((c) => c.id))}
              />
            </th>

            <SortHeader
              label="Name"
              column="name"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />

            <th className="p-3 font-semibold">Status</th>

            <SortHeader
              label="Budget"
              column="budget"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />

            <th className="p-3 font-semibold">Impressions</th>
            <th className="p-3 font-semibold">Clicks</th>

            {/* Actions column */}
            <th className="p-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-medium">No campaigns found</span>
                  <span className="text-xs text-gray-400">
                    Try adjusting your search or filters
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                {/* Row checkbox */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => onToggleOne(c.id)}
                  />
                </td>

                {/* Clickable campaign name */}
                <td className="p-3 font-medium">
                  <Link
                    to={`/campaigns/${c.id}`}
                    className="hover:underline text-blue-600"
                  >
                    {c.name}
                  </Link>
                </td>

                <td className="p-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="p-3">${c.budget}</td>
                <td className="p-3">{c.impressions}</td>
                <td className="p-3">{c.clicks}</td>

                {/* Row action */}
                <td className="p-3 text-right">
                  <button
                    onClick={() => onRowPause(c.id)}
                    disabled={c.status === "paused"}
                    className="text-sm text-blue-600 disabled:opacity-40"
                  >
                    Pause
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const colors = {
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    draft: "bg-gray-200 text-gray-700",
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  )
}