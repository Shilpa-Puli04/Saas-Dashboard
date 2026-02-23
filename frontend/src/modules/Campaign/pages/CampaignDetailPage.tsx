import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { campaignsMock } from "../mock"
import OverviewTab from "./OverviewTab"
import AssetsTab from "../components/AssetsTab"
import PerformanceTab from "./PerformanceTab"
import {
  getCampaignAssets,
  saveCampaignAssets,
  type Asset,
} from "../services/campaignService"

type Tab = "overview" | "assets" | "performance"

export default function CampaignDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const campaignId = params.id ? String(params.id) : null

  const campaign = campaignsMock.find(
    (c) => String(c.id) === campaignId
  )

  const [tab, setTab] = useState<Tab>("overview")
  const [assets, setAssets] = useState<Asset[]>([])

  const hasLoadedRef = useRef(false)
  useEffect(() => {
    if (!campaignId) return
    if (hasLoadedRef.current) return

    const stored = getCampaignAssets(campaignId)

    if (stored && stored.length > 0) {
      setAssets(stored)
    }

    hasLoadedRef.current = true
  }, [campaignId])
  useEffect(() => {
    if (!campaignId) return
    if (!hasLoadedRef.current) return

    saveCampaignAssets(campaignId, assets)
  }, [assets, campaignId])

  if (!campaignId || !campaign) {
    return (
      <div className="text-red-500">
        Campaign not found
      </div>
    )
  }

  function updateAssets(
    updater: (prev: Asset[]) => Asset[]
  ) {
    setAssets((prev) => updater(prev))
  }

  return (
    <div>
    
      <button
        onClick={() => navigate("/campaigns")}
        className="text-sm text-blue-600 mb-2 hover:underline flex items-center gap-1"
      >
        ← Back to Campaigns
      </button>

     
      <h1 className="text-xl font-semibold mb-4">
        {campaign.name}
      </h1>

    
      <div className="flex gap-6 border-b mb-6">
        <TabButton
          label="Overview"
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        />
        <TabButton
          label="Assets"
          active={tab === "assets"}
          onClick={() => setTab("assets")}
        />
        <TabButton
          label="Performance"
          active={tab === "performance"}
          onClick={() => setTab("performance")}
        />
      </div>

     
      {tab === "overview" && (
        <OverviewTab id={campaignId} />
      )}

      {tab === "assets" && (
        <AssetsTab
          assets={assets}
          setAssets={updateAssets}
        />
      )}

      {tab === "performance" && (
        <PerformanceTab id={campaignId} />
      )}
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-sm font-medium transition ${
        active
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  )
}