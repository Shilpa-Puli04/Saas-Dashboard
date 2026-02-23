import { Outlet, NavLink } from "react-router-dom"

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
            S
          </div>
          <span className="ml-3 font-semibold text-lg">SaaS Console</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/campaigns" label="Campaigns" />
          <NavItem to="/jobs" label="Jobs" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="font-semibold text-slate-800">
            Enterprise Dashboard
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">Shilpa</div>
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
              S
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}



function NavItem({
  to,
  label
}: {
  to: string
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm font-medium transition
         ${
           isActive
             ? "bg-indigo-600 text-white shadow-sm"
             : "text-slate-300 hover:bg-slate-800 hover:text-white"
         }`
      }
    >
      {label}
    </NavLink>
  )
}