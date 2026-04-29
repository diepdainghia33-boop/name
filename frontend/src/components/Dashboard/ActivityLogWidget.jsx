import { useEffect, useRef } from "react";

export default function ActivityLogWidget({ logs }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogTone = (log) => {
        if (log.type === "success") return "bg-success";
        if (log.type === "warning") return "bg-warning";
        if (log.type === "error") return "bg-danger";
        return "bg-accent";
    };

    const getLogLabel = (log) => {
        if (log.message.includes("Blueprint") || log.message.includes("accessed")) return "Blueprint Accessed";
        if (log.message.includes("Identity") || log.message.includes("Settings")) return "Settings Modified";
        if (log.message.includes("Security")) return "Security Scan";
        if (log.message.includes("Key")) return "New Key Issued";
        if (log.message.includes("Login")) return "Account Login";
        return "System Event";
    };

    return (
        <div className="flex h-80 flex-col overflow-hidden rounded-[28px] border border-border/70 bg-surface p-6 shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                Activity Log
            </h3>

            <div ref={logRef} className="custom-scrollbar flex-1 space-y-5 overflow-y-auto pr-2">
                {logs.length === 0 ? (
                    <div className="text-xs text-text-muted">No recent activity...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={log.id || i} className="relative rounded-[20px] border border-border/70 bg-background px-4 py-3">
                            <div className={`absolute left-0 top-3 h-10 w-1 rounded-full ${getLogTone(log)}`} />
                            <p className="text-[11px] font-bold text-text">{getLogLabel(log)}</p>
                            <p className="mt-1 text-[10px] leading-relaxed text-text-muted">{log.message}</p>
                            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.24em] text-text-dim">
                                {log.time}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <button className="mt-6 rounded-2xl border border-border/70 bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-muted transition-colors hover:border-accent/40 hover:text-text">
                View full archive
            </button>
        </div>
    );
}
