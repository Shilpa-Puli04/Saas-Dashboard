export type Asset = {
  id: string
  name: string
  progress: number
  uploading: boolean
}

export type Campaign = {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  budget: number
  impressions: number
  clicks: number
  assets?: Asset[] 
}