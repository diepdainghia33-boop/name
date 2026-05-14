export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border/70 px-8 py-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-xs text-text-dim">© 2024 ChatID Architect</span>
                </div>

                <div className="flex items-center gap-6">
                    <button type="button" className="text-xs uppercase tracking-wider text-text-dim transition-colors hover:text-text">Privacy</button>
                    <button type="button" className="text-xs uppercase tracking-wider text-text-dim transition-colors hover:text-text">Documentation</button>
                    <button type="button" className="text-xs uppercase tracking-wider text-text-dim transition-colors hover:text-text">Support</button>
                </div>
            </div>
        </footer>
    );
}
