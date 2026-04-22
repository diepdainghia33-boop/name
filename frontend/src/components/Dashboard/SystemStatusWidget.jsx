import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || "http://127.0.0.1:8001";
const BAR_COUNT = 9;

export default function SystemStatusWidget({ health = null }) {
    const [cpuLoad, setCpuLoad] = useState(null);
    const [bars, setBars] = useState(Array(BAR_COUNT).fill(0));

    useEffect(() => {
        let mounted = true;

        const fetchSystemStats = async () => {
            try {
                const response = await axios.get(`${AI_SERVICE_URL}/api/stats`, {
                    timeout: 3000
                });

                const rawLoad = response.data?.cpu_load;
                if (!mounted || rawLoad === null || rawLoad === undefined || rawLoad === "") return;

                const load = Number(rawLoad);
                if (Number.isNaN(load)) return;

                const clampedLoad = Math.max(0, Math.min(100, load));

                setCpuLoad(clampedLoad);
                setBars(prev => {
                    const nextBars = [...prev.slice(1), clampedLoad];
                    if (prev.every(value => value === 0)) {
                        return Array(BAR_COUNT).fill(clampedLoad);
                    }
                    return nextBars;
                });
            } catch (error) {
                console.error("Error fetching CPU stats:", error);
            }
        };

        fetchSystemStats();
        const interval = window.setInterval(fetchSystemStats, 5000);

        return () => {
            mounted = false;
            window.clearInterval(interval);
        };
    }, []);

    const hasHealth = typeof health === "number" && !Number.isNaN(health);
    const isHealthy = hasHealth ? health > 90 : null;
    const statusTone =
        isHealthy === null ? "bg-slate-400" : isHealthy ? "bg-emerald-400" : "bg-red-400";
    const statusText =
        isHealthy === null ? "UNKNOWN" : isHealthy ? "OPERATIONAL" : "DEGRADED";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-2xl overflow-hidden group"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <h3 className="relative z-10 font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center justify-between">
                System Pulse
                <span className="flex h-2 w-2 relative">
                    {isHealthy !== null && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusTone} opacity-75`}></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${statusTone}`}></span>
                </span>
            </h3>

            <div className="relative z-10 space-y-5">
                {/* Neural Engine */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isHealthy === null ? 'bg-slate-400' : isHealthy ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-red-400'}`}></div>
                        <span className="text-xs font-bold text-white tracking-tight">Neural Core</span>
                    </div>
                    <span className={`text-[9px] font-black tracking-widest ${isHealthy === null ? 'text-slate-400' : isHealthy ? 'text-blue-400' : 'text-red-400'}`}>
                        {statusText}
                    </span>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
                        <span className="text-xs font-bold text-white tracking-tight">Vector Storage</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest text-cyan-400">SYNCED</span>
                </div>

                {/* CPU Mini Graph */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CPU Load</span>
                        <span className="text-xs font-black text-white">
                            {cpuLoad === null ? "--" : `${cpuLoad}%`}
                        </span>
                    </div>
                    <div className="flex gap-[3px] h-10 items-end">
                        {bars.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(0, Math.min(100, h))}%` }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`flex-1 rounded-full ${i === bars.length - 1 ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
