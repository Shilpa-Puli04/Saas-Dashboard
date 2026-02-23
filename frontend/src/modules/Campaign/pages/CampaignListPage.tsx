import { useEffect, useState } from "react"
import { fetchCampaigns, pauseCampaignsApi } from "../services/campaignService"
import type { Campaign } from "../types"
import CampaignTable from "../components/CampaignTable"
import CampaignTableSkeleton from "../components/CampaignTableSkeleton"
import { useDebounce } from "../hooks/useDebounce"

export default function CampaignListPage() {
  const [data, setData] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortKey, setSortKey] = useState<"name" | "budget" | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

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

  async function loadCampaigns() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchCampaigns()
      setData(res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    setSelected([])
  }, [page])

  const isSearching = search !== debouncedSearch

  const filtered = data.filter((c) => {
    const matchesSearch = c.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())

    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(c.status)

    return matchesSearch && matchesStatus
  })
  const sortedData = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const valA = a[sortKey]
    const valB = b[sortKey]
    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

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

  function handleSort(key: "name" | "budget") {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }


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

   
    setData((prev) =>
      prev.map((c) =>
        prevState.some((p) => p.id === c.id)
          ? { ...c, status: "paused" }
          : c
      )
    )

    try {
      await pauseCampaignsApi(prevState.map((p) => p.id))

      setSelected([])
      setToast({
        message: `${prevState.length} campaign${
          prevState.length > 1 ? "s" : ""
        } paused`,
      })
    } catch {
     
      setData((prev) =>
        prev.map((c) => {
          const old = prevState.find((p) => p.id === c.id)
          return old ? { ...c, status: old.status } : c
        })
      )
      setToast({
        message: "Pause failed. Changes reverted.",
      })
    } finally {
      setMutating(false)
      setTimeout(() => setToast(null), 4000)
    }
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

    try {
      await pauseCampaignsApi([id])
      setToast({ message: "Campaign paused" })
    } catch {
      setData((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: prevStatus } : c
        )
      )
      setToast({ message: "Pause failed" })
    }

    setTimeout(() => setToast(null), 4000)
  }

  const hasPausable = data.some(
    (c) => selected.includes(c.id) && c.status !== "paused"
  )

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4">
          Campaigns
        </h1>
        <CampaignTableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-2">
          Failed to load campaigns
        </div>
        <button
          onClick={loadCampaigns}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }

 return (
  <div className="space-y-6">

    {/* Title */}
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Campaigns
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Manage and monitor campaign performance
      </p>
    </div>

   
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-2xl" />

      <div className="relative bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 pl-4 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {isSearching && (
            <span className="text-xs text-slate-500">
              Searching…
            </span>
          )}
        </div>

        {/* Filters */}
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter([])}
            className={`px-3.5 py-1.5 text-sm rounded-full border transition ${
              statusFilter.length === 0
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            All
          </button>

          {(["active", "paused", "draft"] as Campaign["status"][]).map(
            (s) => {
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
                  {s}
                </button>
              )
            }
          )}

          {/* Clear */}
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="ml-2 px-3.5 py-1.5 text-sm rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
            >
              Clear ({statusFilter.length})
            </button>
          )}
        </div>

        {/* Bulk Bar */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between bg-indigo-600/5 border border-indigo-200 px-4 py-2.5 rounded-xl">
            <span className="text-sm font-medium text-indigo-700">
              {selected.length} selected
            </span>

            <button
              onClick={handleBulkPause}
              disabled={!hasPausable || mutating}
              className="px-3.5 py-1.5 text-sm bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-2"
            >
              {mutating && (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Pause selected
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Table Stage */}
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl" />

      <div className="relative border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
      </div>
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-between text-sm text-slate-600">
      <span>
        Showing {(page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, total)} of {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-2 text-slate-500">
          {page} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={page === totalPages || totalPages === 0}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-4">
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