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
                const response = await axios.get(`${AI_SERVICE_URL}/api/stats`, { timeout: 3000 });
                const rawLoad = response.data?.cpu_load;
                if (!mounted || rawLoad === null || rawLoad === undefined || rawLoad === "") return;

                const load = Number(rawLoad);
                if (Number.isNaN(load)) return;

                const clampedLoad = Math.max(0, Math.min(100, load));
                setCpuLoad(clampedLoad);
                setBars((prev) => {
                    const nextBars = [...prev.slice(1), clampedLoad];
                    if (prev.every((value) => value === 0)) {
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
    const statusTone = isHealthy === null ? "bg-text-dim" : isHealthy ? "bg-success" : "bg-danger";
    const statusText = isHealthy === null ? "UNKNOWN" : isHealthy ? "OPERATIONAL" : "DEGRADED";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-[32px] border border-border/70 bg-surface p-6 shadow-[0_18px_42px_rgba(0,0,0,0.24)]"
        >
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="relative z-10 mb-6 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                    System Pulse
                </h3>
                <span className="flex items-center gap-2">
                    {isHealthy !== null && <span className={`h-2 w-2 rounded-full ${statusTone} animate-pulse`} />}
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted">
                        {statusText}
                    </span>
                </span>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between rounded-[22px] border border-border/70 bg-background px-4 py-3 transition-colors hover:bg-surface-strong">
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${statusTone}`} />
                        <span className="text-xs font-bold tracking-tight text-text">Neural Core</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.24em] ${isHealthy === null ? "text-text-dim" : isHealthy ? "text-success" : "text-danger"}`}>
                        {statusText}
                    </span>
                </div>

                <div className="flex items-center justify-between rounded-[22px] border border-border/70 bg-background px-4 py-3 transition-colors hover:bg-surface-strong">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span className="text-xs font-bold tracking-tight text-text">Vector Storage</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-accent">Synced</span>
                </div>

                <div className="rounded-[24px] border border-border/70 bg-background-elevated p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted">CPU Load</span>
                        <span className="text-xs font-black text-text">{cpuLoad === null ? "--" : `${cpuLoad}%`}</span>
                    </div>
                    <div className="flex h-10 items-end gap-[3px]">
                        {bars.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(0, Math.min(100, h))}%` }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`flex-1 rounded-full ${i === bars.length - 1 ? "bg-accent" : "bg-border/70"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
