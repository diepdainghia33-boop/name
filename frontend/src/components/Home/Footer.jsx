export default function Footer() {
    return (
        <footer className="px-6 pb-12 pt-8 sm:px-8">
            <div className="mx-auto max-w-7xl border-t border-border/70 pt-8">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                            Architect AI
                        </p>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-text">
                            An AI platform that keeps the screen quiet and the work visible.
                        </h3>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                            Command center UI for chat, dashboards, and settings without the generic neon treatment.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="app-panel rounded-[28px] p-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Product
                            </h4>
                            <ul className="mt-4 space-y-3 text-sm text-text-muted">
                                <li>Workspace</li>
                                <li>Analytics</li>
                                <li>Settings</li>
                            </ul>
                        </div>
                        <div className="app-panel rounded-[28px] p-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Support
                            </h4>
                            <ul className="mt-4 space-y-3 text-sm text-text-muted">
                                <li>Docs</li>
                                <li>Security</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-border/70 pt-6 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
                    <p>© 2026 Architect AI. All rights reserved.</p>
                    <div className="flex flex-wrap gap-4">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>API</span>
                        <span>Support</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
