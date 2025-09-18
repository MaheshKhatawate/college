import { Link } from "react-router-dom"

function AdminHeader({ onToggleSidebar, isSidebarOpen }){
    return (
        <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex h-14 items-center gap-4 px-4">
                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border bg-card hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                    {isSidebarOpen ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    )}
                </button>
                <Link to="/admin/dashboard" className="font-semibold text-lg tracking-tight">
                    Admin Panel
                </Link>
                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden md:flex items-center rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground w-48">
                        <span className="truncate">Search…</span>
                    </div>
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        Dr.
                    </button>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader