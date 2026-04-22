import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, Zap } from "lucide-react";

export default function ConversationTrends({ trends = [] }) {
    if (!trends || trends.length === 0) return (
        <div className="h-48 flex items-center justify-center bg-white/5 rounded-[28px] border border-dashed border-white/10 text-slate-500 text-xs uppercase tracking-widest">
            Loading neural patterns...
        </div>
    );

    const data = trends.map(t => t.count);
    const labels = trends.map(t => t.day);
    
    const width = 600;
    const height = 180;
    const chartPaddingX = 24;
    const chartPaddingTop = 22;
    const chartPaddingBottom = 34;
    const chartWidth = width - chartPaddingX * 2;
    const chartHeight = height - chartPaddingTop - chartPaddingBottom;
    const rawMax = Math.max(...data);
    const maxVal = rawMax > 0
        ? Math.max(Math.ceil(rawMax * 1.15), rawMax + 1)
        : 1;
    const scaleY = chartHeight / maxVal;

    const points = data.map((d, i) => ({
        x: data.length === 1
            ? width / 2
            : chartPaddingX + (i / (data.length - 1)) * chartWidth,
        y: chartPaddingTop + chartHeight - d * scaleY
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

    const total = data.reduce((a, b) => a + b, 0);
    const peak = Math.max(...data);
    const avg = (total / data.length).toFixed(1);

    return (
        <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] p-1 shadow-2xl transition-all hover:border-blue-500/30">
            {/* Subtle background glow */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] transition-all group-hover:bg-blue-500/20" />
            
            <div className="relative flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
                {/* Stats Sidebar */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-center gap-6 lg:border-r lg:border-white/5 lg:pr-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            <Zap size={10} /> Total
                        </div>
                        <p className="text-3xl font-black text-white">{total}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                            <TrendingUp size={10} /> Peak
                        </div>
                        <p className="text-3xl font-black text-white">{peak}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <MessageSquare size={10} /> Avg/Day
                        </div>
                        <p className="text-3xl font-black text-white">{avg}</p>
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Conversation Intelligence</h2>
                            <p className="text-xs text-slate-500 font-medium">Neural activity over the last 7 cycles</p>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-1 w-1 rounded-full bg-blue-500/30" />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[220px] w-full">
                        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="premiumTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 2, ease: "circOut" }}
                                d={areaPath}
                                fill="url(#premiumTrendGradient)"
                            />
                            
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.8, ease: "circOut" }}
                                d={linePath}
                                stroke="#3b82f6"
                                fill="none"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="drop-shadow-[0_4px_10px_rgba(59,130,246,0.5)]"
                            />

                            {points.map((p, i) => (
                                <g key={i}>
                                    <motion.circle
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                                        cx={p.x}
                                        cy={p.y}
                                        r="5"
                                        fill="#ffffff"
                                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    />
                                    <motion.circle
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                                        cx={p.x}
                                        cy={p.y}
                                        r="2"
                                        fill="#3b82f6"
                                    />
                                </g>
                            ))}

                            {labels.map((label, i) => {
                                const x = labels.length === 1
                                    ? width / 2
                                    : chartPaddingX + (i / (labels.length - 1)) * chartWidth;
                                return (
                                    <text key={i} x={x} y={height - 8} fontSize="12" textAnchor="middle" fill="#475569" className="font-bold uppercase tracking-tighter">
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
