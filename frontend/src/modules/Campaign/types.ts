export type CampaignStatus = "active" | "paused" | "draft"

export type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  budget: number
  impressions: number
  clicks: number
}