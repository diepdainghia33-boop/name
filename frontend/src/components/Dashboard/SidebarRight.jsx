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
        <aside className="w-80 h-full bg-black/80 backdrop-blur-xl border-l border-white/5 flex flex-col shrink-0">
            <div className="p-6 border-b border-white/5">
                <h3 className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] font-bold text-[#adaaaa] mb-6">
                    System Status
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85adff] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#85adff]"></span>
                            </div>
                            <span className="text-xs font-bold text-white">Neural Engine</span>
                        </div>
                        <span className="text-[10px] font-['Space_Grotesk'] text-[#85adff]">OPERATIONAL</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#8097ff]"></div>
                            <span className="text-xs font-bold text-white">Vector DB</span>
                        </div>
                        <span className="text-[10px] font-['Space_Grotesk'] text-[#8097ff]">SYNCED</span>
                    </div>
                    {/* Mini Graph */}
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-['Space_Grotesk'] text-[#adaaaa]">CPU LOAD</span>
                            <span className="text-[10px] font-['Space_Grotesk'] text-white">42%</span>
                        </div>
                        <div className="flex gap-[2px] h-8 items-end">
                            <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                            <div className="flex-1 bg-[#1a1919] h-2/3 rounded-sm"></div>
                            <div className="flex-1 bg-[#85adff] h-3/4 rounded-sm"></div>
                            <div className="flex-1 bg-[#85adff] h-1/3 rounded-sm"></div>
                            <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                            <div className="flex-1 bg-[#1a1919] h-3/4 rounded-sm"></div>
                            <div className="flex-1 bg-[#85adff] h-full rounded-sm shadow-[0_0_8px_rgba(133,173,255,0.4)]"></div>
                            <div className="flex-1 bg-[#1a1919] h-2/3 rounded-sm"></div>
                            <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <h3 className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] font-bold text-[#adaaaa] mb-6">
                    Activity Log
                </h3>
                <div ref={logRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {logs.length === 0 ? (
                        <div className="text-[#adaaaa] text-xs">No recent activity...</div>
                    ) : (
                        logs.map((log, i) => {
                            // Determine color based on log content
                            let color = "bg-[#1a1919]";
                            if (log.includes("Identity") || log.includes("Settings")) color = "bg-[#85adff]";
                            if (log.includes("Security")) color = "bg-[#8097ff]";

                            return (
                                <div key={i} className="relative pl-6 border-l border-white/10">
                                    <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${color}`}></div>
                                    <p className="text-[11px] font-bold text-white">
                                        {log.includes("Identity") ? "Settings Modified" :
                                         log.includes("Security") ? "Security Scan" :
                                         log.includes("Key") ? "New Key Issued" :
                                         log.includes("Login") ? "Account Login" : "System Event"}
                                    </p>
                                    <p className="text-[10px] text-[#adaaaa] mt-1 leading-relaxed">{log}</p>
                                    <p className="text-[9px] font-['Space_Grotesk'] text-gray-600 mt-2">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
                <button
                    onClick={() => addLog("📋 Archive requested")}
                    className="w-full mt-6 py-2 bg-white/5 rounded-lg text-[10px] font-['Space_Grotesk'] uppercase tracking-widest text-[#adaaaa] hover:text-white transition-all border border-white/5 hover:border-[#85adff]/30"
                >
                    View Full Archive
                </button>
            </div>
            {/* Footer Identity */}
            <div className="p-6 bg-black/20 border-t border-white/5">
                <div className="flex items-center gap-3 opacity-30">
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <p className="text-[9px] font-['Space_Grotesk'] leading-tight text-[#adaaaa]">
                        END-TO-END QUANTUM ENCRYPTION ACTIVE
                    </p>
                </div>
            </div>
        </aside>
    );
}
