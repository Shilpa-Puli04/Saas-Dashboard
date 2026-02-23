import type { Campaign } from "../types"
import { campaignsMock } from "../mock"

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

function randomFail(rate = 0.2) {
  if (Math.random() < rate) {
    throw new Error("Network error. Please try again.")
  }
}
//const ASSETS_KEY = "campaign_assets"
export type Asset = {
  id: string
  name: string
  progress: number
  uploading: boolean
}

const KEY = "campaign_assets"

export function getCampaignAssets(
  campaignId: string
): Asset[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []

  const store = JSON.parse(raw) as Record<
    string,
    Asset[]
  >

  return store[campaignId] ?? []
}

export function saveCampaignAssets(
  campaignId: string,
  assets: Asset[]
) {
  const raw = localStorage.getItem(KEY)

  const store: Record<string, Asset[]> = raw
    ? JSON.parse(raw)
    : {}

  store[campaignId] = assets

  localStorage.setItem(KEY, JSON.stringify(store))
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(700 + Math.random() * 600)
  randomFail(0.15)
  return campaignsMock.map((c) => ({ ...c }))
}

export async function pauseCampaignsApi(
  _ids: string[]
): Promise<void> {
  await delay(600 + Math.random() * 500)
  randomFail(0.2)
}