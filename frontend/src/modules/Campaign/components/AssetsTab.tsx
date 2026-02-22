import React from "react"

type Asset = {
  id: string
  name: string
}

type Props = {
  assets: Asset[]
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>
}

export default function AssetsTab({
  assets,
  setAssets,
}: Props) {
  function handleFiles(files: FileList | null) {
    if (!files) return

    const newAssets = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
    }))

    setAssets((prev) => [...prev, ...newAssets])
  }

  function removeAsset(id: string) {
    setAssets((prev) =>
      prev.filter((a) => a.id !== id)
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center block cursor-pointer">
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) =>
            handleFiles(e.target.files)
          }
        />

        <span className="text-sm text-gray-600">
          Drag & drop files here or{" "}
          <span className="text-blue-600 underline">
            browse
          </span>
        </span>
      </label>

      {/* Assets list */}
      {assets.length === 0 ? (
        <div className="text-sm text-gray-500">
          No assets uploaded
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between border rounded p-3"
            >
              <span>{a.name}</span>

              <button
                onClick={() =>
                  removeAsset(a.id)
                }
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}