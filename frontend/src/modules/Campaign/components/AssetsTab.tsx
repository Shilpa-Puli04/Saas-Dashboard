import { useState } from "react"
import type { Asset } from "../services/campaignService"

type Props = {
  assets: Asset[]
  setAssets: (updater: (a: Asset[]) => Asset[]) => void
}

export default function AssetsTab({
  assets,
  setAssets,
}: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function simulateUpload(file: File) {
    const id = crypto.randomUUID()

    const newAsset: Asset = {
      id,
      name: file.name,
      progress: 0,
      uploading: true,
    }

    setAssets((prev) => [...prev, newAsset])

    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a

          const next = Math.min(100, a.progress + 15)

          if (next === 100) {
            clearInterval(interval)
            return { ...a, progress: 100, uploading: false }
          }

          return { ...a, progress: next }
        })
      )
    }, 250)
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(simulateUpload)
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  function confirmRemove(id: string) {
    setConfirmId(id)
  }

  function removeAsset() {
    if (!confirmId) return
    setAssets((prev) => prev.filter((a) => a.id !== confirmId))
    setConfirmId(null)
  }

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer transition
        ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <span className="text-sm text-gray-600">
          Drag & drop files here or{" "}
          <span className="text-blue-600 underline">
            browse
          </span>
        </span>
      </label>

      {assets.length === 0 ? (
        <div className="text-sm text-gray-500">
          No assets uploaded
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((a) => (
            <div
              key={a.id}
              className="border rounded p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {a.name}
                </span>

                {!a.uploading && (
                  <button
                    onClick={() => confirmRemove(a.id)}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              {a.uploading && (
                <>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded transition-all"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    Uploading {a.progress}%
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {confirmId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-5 w-80">
            <div className="text-sm mb-4">
              Remove this asset?
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-3 py-1 text-sm border rounded"
              >
                Cancel
              </button>

              <button
                onClick={removeAsset}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}