import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function SidebarRight({ user, logs, addLog }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border/70 bg-background/95 backdrop-blur-xl">
            <div className="border-b border-border/70 p-6">
                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                    System status
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                            </div>
                            <span className="text-xs font-bold text-text">Neural Engine</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-success">Operational</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <span className="text-xs font-bold text-text">Vector DB</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-accent">Synced</span>
                    </div>

                    <div className="rounded-[22px] border border-border/70 bg-surface p-3">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted">CPU Load</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-text">42%</span>
                        </div>
                        <div className="flex h-8 items-end gap-[2px]">
                            <div className="h-1/2 flex-1 rounded-sm bg-border/70" />
                            <div className="h-2/3 flex-1 rounded-sm bg-border/70" />
                            <div className="h-3/4 flex-1 rounded-sm bg-accent" />
                            <div className="h-1/3 flex-1 rounded-sm bg-accent" />
                            <div className="h-1/2 flex-1 rounded-sm bg-border/70" />
                            <div className="h-3/4 flex-1 rounded-sm bg-border/70" />
                            <div className="h-full flex-1 rounded-sm bg-accent" />
                            <div className="h-2/3 flex-1 rounded-sm bg-border/70" />
                            <div className="h-1/2 flex-1 rounded-sm bg-border/70" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden p-6">
                <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                    Activity Log
                </h3>

                <div ref={logRef} className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                    {logs.length === 0 ? (
                        <div className="text-xs text-text-muted">No recent activity...</div>
                    ) : (
                        logs.map((log, i) => {
                            let tone = "bg-accent";
                            if (log.includes("Identity") || log.includes("Settings")) tone = "bg-success";
                            if (log.includes("Security")) tone = "bg-warning";

                            return (
                                <div key={i} className="relative rounded-[20px] border border-border/70 bg-surface px-4 py-3">
                                    <div className={`absolute left-0 top-3 h-10 w-1 rounded-full ${tone}`} />
                                    <p className="text-[11px] font-bold text-text">
                                        {log.includes("Identity")
                                            ? "Settings Modified"
                                            : log.includes("Security")
                                                ? "Security Scan"
                                                : log.includes("Key")
                                                    ? "New Key Issued"
                                                    : log.includes("Login")
                                                        ? "Account Login"
                                                        : "System Event"}
                                    </p>
                                    <p className="mt-1 text-[10px] leading-relaxed text-text-muted">{log}</p>
                                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.24em] text-text-dim">
                                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>

                <button
                    onClick={() => addLog("📋 Archive requested")}
                    className="mt-6 rounded-2xl border border-border/70 bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-muted transition-colors hover:border-accent/40 hover:text-text"
                >
                    View full archive
                </button>
            </div>

            <div className="border-t border-border/70 bg-surface p-6">
                <div className="flex items-center gap-3 text-text-muted opacity-60">
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <p className="text-[9px] font-black uppercase leading-tight tracking-[0.24em]">
                        End-to-end encryption active
                    </p>
                </div>
            </div>
        </aside>
    );
}
