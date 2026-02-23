import type { Campaign } from "./types"

export const campaignsMock: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale",
    status: "active",
    budget: 5000,
    impressions: 12000,
    clicks: 900,
    assets:[]
  },
  {
    id: "2",
    name: "Diwali Promo",
    status: "paused",
    budget: 3000,
    impressions: 8000,
    clicks: 500,
    assets:[]
  },
  {
    id: "3",
    name: "New Launch",
    status: "draft",
    budget: 7000,
    impressions: 15000,
    clicks: 1100,
    assets:[]
  },
  {
    id: "4",
    name: "Clearance Sale",
    status: "active",
    budget: 7000,
    impressions: 15000,
    clicks: 1100,
    assets:[]
  },
  {
    id: "5",
    name: "Holiday Deals",
    status: "paused",
    budget: 8000,
    impressions: 5000,
    clicks: 900,
    assets:[]
  },
  {
    id: "6",
    name: "Back to School",
    status: "draft",
    budget: 900,
    impressions: 8000,
    clicks: 900,
    assets:[]
  },
]