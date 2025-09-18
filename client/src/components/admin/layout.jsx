import AdminHeader from "./header"
import AdminFooter from "./footer"
import { NavLink } from "react-router-dom"
import { useState } from "react"
import { Outlet } from "react-router-dom"

function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navLinks = [
        { to: "/main/home", label: "Home", icon:HomeIcon},
        { to: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
        { to: "/admin/patients", label: "Patients", icon: UsersIcon },
        { to: "/admin/reports", label: "Reports", icon: ReportIcon },
        { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ]

    return (
        <div className="min-h-screen w-full flex flex-col bg-background">
            <AdminHeader onToggleSidebar={() => setSidebarOpen(o => !o)} isSidebarOpen={sidebarOpen} />
            <div className="flex-1 flex w-full">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r bg-sidebar lg:p-4 pt-20 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="mb-6 hidden lg:block">
                        <h2 className="px-2 text-sm font-semibold tracking-wide text-muted-foreground">Navigation</h2>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/60 hover:text-accent-foreground ${isActive ? 'bg-accent text-primary' : 'text-muted-foreground'}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content wrapper */}
                <div className="flex flex-col flex-1 lg:ml-0">
                    <main className="flex-1 w-full overflow-y-auto p-4 lg:p-6">
                        <div className="mx-auto max-w-7xl space-y-6">
                            <Outlet />
                        </div>
                    </main>
                    <AdminFooter />
                </div>
            </div>

            {/* Sidebar toggle moved into header for mobile */}
        </div>
    )
}

export default AdminLayout

// --- Small inline icon components (avoids extra dependency) ---

function DashboardIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    )
}

function UsersIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )
}

function ReportIcon(props) {
    return (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-plus-icon lucide-clipboard-plus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6"/><path d="M12 17v-6"/></svg>   
    )
}

function SettingsIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>
    )
}


function HomeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
    )
}