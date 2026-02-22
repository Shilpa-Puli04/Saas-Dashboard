import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { campaignsMock } from "../mock"
import OverviewTab from "./OverviewTab"
import AssetsTab from "../components/AssetsTab"

type Tab = "overview" | "assets" | "performance"

type Asset = {
  id: string
  name: string
}

export default function CampaignDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("overview")


  const [assets, setAssets] = useState<Asset[]>([])

  if (!id) return null

  const campaign = campaignsMock.find((c) => c.id === id)

  if (!campaign) {
    return <div className="text-red-500">Campaign not found</div>
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/campaigns")}
        className="text-sm text-blue-600 mb-2 hover:underline flex items-center gap-1"
      >
        ← Back to Campaigns
      </button>

      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">
        {campaign.name}
      </h1>

      {/* Tabs */}
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

      {/* Tab Content */}
      {tab === "overview" && <OverviewTab id={id} />}

      {tab === "assets" && (
        <AssetsTab
          assets={assets}
          setAssets={setAssets}
        />
      )}

      {tab === "performance" && (
        <div>Performance tab coming next</div>
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