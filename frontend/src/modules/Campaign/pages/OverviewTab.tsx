import { useEffect, useState } from "react"
import type { Campaign } from "../types"
import { campaignsMock } from "../mock"

type Props = {
  id: string
}

export default function OverviewTab({ id }: Props) {
  const campaign = campaignsMock.find((c) => c.id === id)

  const [form, setForm] = useState<Campaign | null>(null)
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    budget?: string
  }>({})

  
  useEffect(() => {
    if (campaign) {
      setForm({ ...campaign })
      setDirty(false)
    }
  }, [campaign])

 
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handler)
    return () =>
      window.removeEventListener("beforeunload", handler)
  }, [dirty])

  if (!form) return <div>Campaign not found</div>

  
  function update<K extends keyof Campaign>(
    key: K,
    value: Campaign[K]
  ) {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [key]: value,
      }
    })
    setDirty(true)
  }

  // validation
  function validate() {
    if (!form) return false

    const e: typeof errors = {}

    if (!form.name.trim()) {
      e.name = "Name is required"
    }

    if (form.budget <= 0) {
      e.budget = "Budget must be greater than 0"
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return

    // simulate save
    console.log("Saved campaign:", form)

    setDirty(false)
  }

  return (
    <div className="max-w-lg space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Campaign Name
        </label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {errors.name && (
          <div className="text-xs text-red-500 mt-1">
            {errors.name}
          </div>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Budget ($)
        </label>
        <input
          type="number"
          value={form.budget}
          onChange={(e) =>
            update("budget", Number(e.target.value))
          }
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {errors.budget && (
          <div className="text-xs text-red-500 mt-1">
            {errors.budget}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          value={form.status}
          onChange={(e) =>
            update(
              "status",
              e.target.value as Campaign["status"]
            )
          }
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Save */}
      <div className="pt-2 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
        >
          Save Changes
        </button>

        {dirty && (
          <span className="text-xs text-orange-600">
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  )
}