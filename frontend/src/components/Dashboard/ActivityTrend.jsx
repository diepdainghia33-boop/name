import { motion } from "framer-motion";
import { Activity, Clock } from "lucide-react";

export default function ActivityTrend({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-surface text-xs font-black uppercase tracking-[0.24em] text-muted">
                Syncing activity logs...
            </div>
        );
    }

    const counts = data.map((t) => t.count);
    const labels = data.map((t) => t.day);

    const width = 600;
    const height = 120;
    const maxVal = Math.max(...counts, 5);
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const points = counts.map((d, i) => ({
        x: (i / (counts.length - 1)) * width,
        y: height - d * scaleY - offsetY,
    }));

    const linePath = `
        M ${points[0].x} ${points[0].y}
        ${points
            .slice(1)
            .map((p, i) => {
                const prev = points[i];
                const cx = (prev.x + p.x) / 2;
                return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
            })
            .join(" ")}
    `;

    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-border/70 bg-surface p-5 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted">
                        Event intensity
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.24em] text-text-dim">
                    <Clock size={10} />
                    7 cycles
                </div>
            </div>

            <div className="h-20 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d={linePath}
                        stroke="oklch(var(--color-accent))"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {points.map((p, i) => (
                        <motion.circle
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            fill="oklch(var(--color-accent))"
                        />
                    ))}
                </svg>
            </div>

            <div className="mt-2 flex justify-between">
                {labels.map((label, i) => (
                    <span key={i} className="text-[8px] font-black uppercase tracking-tighter text-text-dim">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
