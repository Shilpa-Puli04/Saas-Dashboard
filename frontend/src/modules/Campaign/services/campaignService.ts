import { campaignsMock } from "../mock"
import type { Campaign } from "../types"

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(800)

  // simulate occasional failure
  if (Math.random() < 0.1) {
    throw new Error("Failed to load campaigns")
  }

  return campaignsMock
}