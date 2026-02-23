import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "./AppLayout"
import CampaignListPage from "../modules/Campaign/pages/CampaignListPage"
import CampaignDetailPage from "../modules/Campaign/pages/CampaignDetailPage"
import JobListPage from "../modules/Jobs/pages/JobListPage"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
          <Route path="/campaigns" element={<CampaignListPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/jobs" element={<JobListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}