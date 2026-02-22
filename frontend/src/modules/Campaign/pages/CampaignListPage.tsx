import { useEffect, useState } from "react"
import { fetchCampaigns } from "../services/campaignService"
import type { Campaign } from "../types"
import CampaignTable from "../components/CampaignTable"

export default function CampaignListPage() {
  const [data, setData] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortKey, setSortKey] = useState<"name" | "budget" | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [mutating, setMutating] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    undo?: () => void
  } | null>(null)

  const [statusFilter, setStatusFilter] = useState<
    Campaign["status"][]
  >([])

  const pageSize = 5


  useEffect(() => {
    fetchCampaigns()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])


  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  
  useEffect(() => {
    setSelected([])
  }, [page])

  // Filter
  const filtered = data.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(c.status)

    return matchesSearch && matchesStatus
  })

  // Sort
  const sortedData = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const valA = a[sortKey]
    const valB = b[sortKey]
    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const total = sortedData.length
  const totalPages = Math.ceil(total / pageSize)

  const pagedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  )


  function toggleOne(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  function toggleAll(ids: string[]) {
    if (selected.length === ids.length) {
      setSelected([])
    } else {
      setSelected(ids)
    }
  }

  function toggleStatusFilter(status: Campaign["status"]) {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

 
  function pauseCampaigns(_ids: string[]) {
    return new Promise<void>((resolve) =>
      setTimeout(resolve, 800)
    )
  }

  // Sort handler
  function handleSort(key: "name" | "budget") {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  // Bulk pause
  async function handleBulkPause() {
    const idsToPause = data.filter(
      (c) => selected.includes(c.id) && c.status !== "paused"
    )

    if (idsToPause.length === 0) return

    const prevState = idsToPause.map((c) => ({
      id: c.id,
      status: c.status,
    }))

    setMutating(true)

    // optimistic update
    setData((prev) =>
      prev.map((c) =>
        prevState.some((p) => p.id === c.id)
          ? { ...c, status: "paused" }
          : c
      )
    )

    await pauseCampaigns(prevState.map((p) => p.id))

    setSelected([])
    setMutating(false)

    
    setToast({
      message: `${prevState.length} campaign${
        prevState.length > 1 ? "s" : ""
      } paused`,
      undo: () => {
        setData((prev) =>
          prev.map((c) => {
            const old = prevState.find((p) => p.id === c.id)
            return old ? { ...c, status: old.status } : c
          })
        )
      },
    })

    setTimeout(() => setToast(null), 4000)
  }
  async function handleRowPause(id: string) {
  const target = data.find((c) => c.id === id)
  if (!target || target.status === "paused") return

  const prevStatus = target.status

 
  setData((prev) =>
    prev.map((c) =>
      c.id === id ? { ...c, status: "paused" } : c
    )
  )

  await pauseCampaigns([id])

  setToast({
    message: `Campaign paused`,
    undo: () => {
      setData((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: prevStatus } : c
        )
      )
    },
  })

  setTimeout(() => setToast(null), 4000)
}

  const hasPausable = data.some(
    (c) => selected.includes(c.id) && c.status !== "paused"
  )

  if (loading) return <div>Loading campaigns...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Campaigns</h1>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Multi-status filter */}
      <div className="mb-3 flex items-center gap-2">
  {/* All */}
  <button
    onClick={() => setStatusFilter([])}
    className={`px-3 py-1 rounded text-sm border ${
      statusFilter.length === 0
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700"
    }`}
  >
    All
  </button>

  {/* Status filters */}
  {(["active", "paused", "draft"] as Campaign["status"][]).map(
    (s) => {
      const active = statusFilter.includes(s)

      return (
        <button
          key={s}
          onClick={() => toggleStatusFilter(s)}
          className={`px-3 py-1 rounded text-sm border ${
            active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700"
          }`}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      )
    }
  )}
</div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="mb-3 flex items-center gap-3 bg-blue-50 border border-blue-200 px-3 py-2 rounded">
          <span className="text-sm font-medium">
            {selected.length} selected
          </span>

          <button
            onClick={handleBulkPause}
            disabled={!hasPausable || mutating}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-40 flex items-center gap-2"
          >
            {mutating && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Pause
          </button>
        </div>
      )}

      {/* Table */}
      <CampaignTable
        data={pagedData}
        onSort={handleSort}
        sortKey={sortKey}
        sortDir={sortDir}
        selected={selected}
        onToggleOne={toggleOne}
        onToggleAll={toggleAll}
        onRowPause={handleRowPause}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <span>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, total)} of {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span>
            {page} / {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-4">
          <span className="text-sm">{toast.message}</span>

          {toast.undo && (
            <button
              onClick={() => {
                toast.undo?.()
                setToast(null)
              }}
              className="text-sm underline"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}