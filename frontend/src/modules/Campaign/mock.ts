import type { Campaign } from "./types"

export const campaignsMock: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale",
    status: "active",
    budget: 5000,
    impressions: 12000,
    clicks: 900,
  },
  {
    id: "2",
    name: "Diwali Promo",
    status: "paused",
    budget: 3000,
    impressions: 8000,
    clicks: 500,
  },
  {
    id: "3",
    name: "New Launch",
    status: "draft",
    budget: 7000,
    impressions: 15000,
    clicks: 1100,
  },
  {
    id: "4",
    name: "Clearance Sale",
    status: "active",
    budget: 7000,
    impressions: 15000,
    clicks: 1100,
  },
  {
    id: "5",
    name: "Holiday Deals",
    status: "paused",
    budget: 8000,
    impressions: 5000,
    clicks: 900,
  },
  {
    id: "6",
    name: "Back to School",
    status: "draft",
    budget: 900,
    impressions: 8000,
    clicks: 900,
  },
]