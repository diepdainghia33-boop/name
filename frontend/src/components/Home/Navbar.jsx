export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl flex justify-between items-center px-8 h-16">
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary font-headline">
                    Architect AI
                </span>
            </div>

            <div className="hidden md:flex gap-8 text-sm">
                <a className="text-primary font-bold">Home</a>
                <a>Features</a>
                <a>Workspace</a>
                <a>Documentation</a>
            </div>

            <div className="flex items-center gap-4">
                <span className="material-symbols-outlined cursor-pointer">
                    notifications
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">
                        account_circle
                    </span>
                </div>
            </div>
        </nav>
    );
}