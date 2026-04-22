import { motion } from "framer-motion";
import { Layers, TrendingUp, Box } from "lucide-react";

export default function BlueprintTrend({ data = [] }) {
    if (!data || data.length === 0) return (
        <div className="h-48 flex items-center justify-center bg-white/5 rounded-[28px] border border-dashed border-white/10 text-slate-500 text-xs uppercase tracking-widest">
            Analyzing architecture patterns...
        </div>
    );

    const counts = data.map(t => t.count);
    const labels = data.map(t => t.day);
    
    const width = 600;
    const height = 160;
    const maxVal = Math.max(...counts, 5);
    const scaleY = (height - 60) / maxVal;
    const offsetY = 30;

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

    const areaPath = `
        ${linePath}
        L ${width} ${height}
        L 0 ${height}
        Z
    `;

    const total = counts.reduce((a, b) => a + b, 0);
    const peak = Math.max(...counts);

    return (
        <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0c0c] p-1 shadow-2xl transition-all hover:border-cyan-500/30">
            {/* Subtle background glow */}
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] transition-all group-hover:bg-cyan-500/20" />
            
            <div className="relative flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                {/* Stats Sidebar */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-center gap-6 lg:border-r lg:border-white/5 lg:pr-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                            <Box size={10} /> Created
                        </div>
                        <p className="text-3xl font-black text-white">{total}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            <TrendingUp size={10} /> Daily Peak
                        </div>
                        <p className="text-3xl font-black text-white">{peak}</p>
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                <Layers size={20} className="text-cyan-400" /> Blueprint Output
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Architecture creation frequency</p>
                        </div>
                    </div>

                    <div className="h-32 w-full">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="blueprintTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: "circOut" }}
                                d={areaPath}
                                fill="url(#blueprintTrendGradient)"
                            />
                            
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.8, ease: "circOut" }}
                                d={linePath}
                                stroke="#22d3ee"
                                fill="none"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                            />

                            {points.map((p, i) => (
                                <g key={i}>
                                    <motion.circle
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                                        cx={p.x}
                                        cy={p.y}
                                        r="4"
                                        fill="#ffffff"
                                    />
                                </g>
                            ))}

                            {labels.map((label, i) => {
                                const x = (i / (labels.length - 1)) * width;
                                return (
                                    <text key={i} x={x} y={height - 5} fontSize="12" textAnchor="middle" fill="#475569" className="font-bold uppercase tracking-tighter">
                                        {label}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
