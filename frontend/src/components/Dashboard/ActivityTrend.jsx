import { motion } from "framer-motion";
import { Activity, Clock } from "lucide-react";

export default function ActivityTrend({ data = [] }) {
    if (!data || data.length === 0) return (
        <div className="h-48 flex items-center justify-center bg-white/5 rounded-[28px] border border-dashed border-white/10 text-slate-500 text-xs uppercase tracking-widest">
            Syncing activity logs...
        </div>
    );

    const counts = data.map(t => t.count);
    const labels = data.map(t => t.day);
    
    const width = 600;
    const height = 120;
    const maxVal = Math.max(...counts, 5);
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const points = counts.map((d, i) => ({
        x: (i / (counts.length - 1)) * width,
        y: height - d * scaleY - offsetY
    }));

    const linePath = `
        M ${points[0].x} ${points[0].y}
        ${points.slice(1).map((p, i) => {
            const prev = points[i];
            const cx = (prev.x + p.x) / 2;
            return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
        }).join(" ")}
    `;

    return (
        <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0e0e0e] p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Event Intensity</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <Clock size={10} /> 7 Cycles
                </div>
            </div>

            <div className="h-20 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d={linePath}
                        stroke="#fbbf24"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
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
                            fill="#fbbf24"
                        />
                    ))}
                </svg>
            </div>
            
            <div className="mt-2 flex justify-between">
                {labels.map((label, i) => (
                    <span key={i} className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
