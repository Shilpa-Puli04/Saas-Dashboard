import { useEffect, useState } from "react"
import { campaignsMock } from "../mock"

type Props = {
  id: string
}

type Metrics = {
  impressions: number
  clicks: number
}

export default function PerformanceTab({ id }: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    loadMetrics()
  }, [id])

  async function loadMetrics() {
    try {
      setLoading(true)
      setError(null)

    
      await new Promise((r) => setTimeout(r, 700))

      const campaign = campaignsMock.find((c) => c.id === id)

      if (!campaign) {
        setMetrics(null)
        return
      }

      setMetrics({
        impressions: campaign.impressions,
        clicks: campaign.clicks,
      })
    } catch (e: any) {
      setError("Failed to load performance")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonChart />
      </div>
    )
  }

 
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={loadMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    )
  }


  if (!metrics || metrics.impressions === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No performance data available
      </div>
    )
  }

  const ctr =
    metrics.impressions > 0
      ? (metrics.clicks / metrics.impressions) * 100
      : 0

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Impressions"
          value={metrics.impressions.toLocaleString()}
        />
        <MetricCard
          label="Clicks"
          value={metrics.clicks.toLocaleString()}
        />
        <MetricCard
          label="CTR"
          value={ctr.toFixed(2) + "%"}
        />
      </div>

    
      <div className="border rounded-lg p-4">
        <div className="font-medium mb-3">
          Performance Trend
        </div>

        <SimpleTrendChart
          impressions={metrics.impressions}
          clicks={metrics.clicks}
        />
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-gray-500">
        {label}
      </div>
      <div className="text-xl font-semibold">
        {value}
      </div>
    </div>
  )
}


function SimpleTrendChart({
  impressions,
  //clicks,
}: {
  impressions: number
  clicks: number
}) {
  const days = 7

  const data = Array.from({ length: days }).map(() =>
    impressions * (0.6 + Math.random() * 0.4)
  )

  return (
    <div className="space-y-2">
      {data.map((value, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="w-12 text-xs text-gray-500">
            Day {idx + 1}
          </div>

          <div className="flex-1 bg-gray-100 h-3 rounded">
            <div
              className="bg-blue-500 h-3 rounded"
              style={{
                width: `${(value / impressions) * 100}%`,
              }}
            />
          </div>

          <div className="w-16 text-xs text-gray-500">
            {Math.round(value)}
          </div>
        </div>
      ))}
    </div>
  )
}



function SkeletonCard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border rounded-lg p-4 animate-pulse"
        >
          <div className="h-3 bg-gray-200 w-16 mb-2 rounded" />
          <div className="h-6 bg-gray-200 w-20 rounded" />
        </div>
      ))}
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="border rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-200 w-40 mb-4 rounded" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-3 bg-gray-200 mb-2 rounded"
        />
      ))}
    </div>
  )
}