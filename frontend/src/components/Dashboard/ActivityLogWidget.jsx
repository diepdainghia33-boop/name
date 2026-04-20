import { useEffect, useRef } from "react";

export default function ActivityLogWidget({ logs }) {
    const logRef = useRef(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogColor = (log) => {
        if (log.type === "success") return "bg-green-500";
        if (log.type === "warning") return "bg-yellow-500";
        if (log.type === "error") return "bg-red-500";
        return "bg-[#1a1919]";
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
        <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden flex flex-col h-80">
            <h3 className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] font-bold text-[#adaaaa] mb-6">
                Activity Log
            </h3>
            <div ref={logRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="text-[#adaaaa] text-xs">No recent activity...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={log.id || i} className="relative pl-6 border-l border-white/10">
                            <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${getLogColor(log)}`}></div>
                            <p className="text-[11px] font-bold text-white">{getLogLabel(log)}</p>
                            <p className="text-[10px] text-[#adaaaa] mt-1 leading-relaxed">{log.message}</p>
                            <p className="text-[9px] font-['Space_Grotesk'] text-gray-600 mt-2">
                                {log.time}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <button className="w-full mt-6 py-2 bg-white/5 rounded-lg text-[10px] font-['Space_Grotesk'] uppercase tracking-widest text-[#adaaaa] hover:text-white transition-all border border-white/5 hover:border-[#85adff]/30">
                View Full Archive
            </button>
        </div>
    );
}
