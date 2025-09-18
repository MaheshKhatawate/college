function AdminFooter(){
    const year = new Date().getFullYear()
    return (
        <footer className="border-t mt-auto bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center md:flex-row md:items-center md:justify-between">
                <p className="text-xs text-muted-foreground order-2 md:order-1">
                    &copy; {year} Ayur Admin. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground order-1 md:order-2">
                    <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#support" className="hover:text-primary transition-colors">Support</a>
                </div>
            </div>
        </footer>
    )
}

export default AdminFooter