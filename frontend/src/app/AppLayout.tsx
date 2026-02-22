import { Outlet } from "react-router-dom"

export default function AppLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white min-h-screen p-4">
        <div className="font-bold text-lg mb-6">SaaS</div>

        <nav className="flex flex-col gap-2">
          <a href="/campaigns">Campaigns</a>
          <a href="/jobs">Jobs</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}