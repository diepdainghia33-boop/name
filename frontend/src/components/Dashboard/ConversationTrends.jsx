import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, Zap } from "lucide-react";

export default function ConversationTrends({ trends = [] }) {
    if (!trends || trends.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center rounded-[32px] border border-dashed border-border/70 bg-surface text-xs font-black uppercase tracking-[0.24em] text-muted">
                Loading neural patterns...
            </div>
        );
    }

    const data = trends.map((t) => t.count);
    const labels = trends.map((t) => t.day);

    const width = 600;
    const height = 180;
    const chartPaddingX = 24;
    const chartPaddingTop = 22;
    const chartPaddingBottom = 34;
    const chartWidth = width - chartPaddingX * 2;
    const chartHeight = height - chartPaddingTop - chartPaddingBottom;
    const rawMax = Math.max(...data);
    const maxVal = rawMax > 0 ? Math.max(Math.ceil(rawMax * 1.15), rawMax + 1) : 1;
    const scaleY = chartHeight / maxVal;

    const points = data.map((d, i) => ({
        x: data.length === 1 ? width / 2 : chartPaddingX + (i / (data.length - 1)) * chartWidth,
        y: chartPaddingTop + chartHeight - d * scaleY,
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
        <div className="group relative overflow-hidden rounded-[32px] border border-border/70 bg-surface p-1 shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition-all hover:border-accent/30">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-[80px] transition-all group-hover:bg-accent/15" />

            <div className="relative flex flex-col gap-8 p-6 lg:flex-row lg:p-8">
                <div className="flex flex-row justify-between gap-6 lg:flex-col lg:justify-center lg:border-r lg:border-border/70 lg:pr-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                            <Zap size={10} /> Total
                        </div>
                        <p className="text-3xl font-black text-text">{total}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-success">
                            <TrendingUp size={10} /> Peak
                        </div>
                        <p className="text-3xl font-black text-text">{peak}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim">
                            <MessageSquare size={10} /> Avg/day
                        </div>
                        <p className="text-3xl font-black text-text">{avg}</p>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-text">
                                Conversation Intelligence
                            </h2>
                            <p className="text-xs text-text-muted">Neural activity over the last 7 cycles</p>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-1 w-1 rounded-full bg-accent/30" />
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[220px] w-full flex-1">
                        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="premiumTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(var(--color-accent))" stopOpacity="0.22" />
                                    <stop offset="100%" stopColor="oklch(var(--color-accent))" stopOpacity="0" />
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
                                stroke="oklch(var(--color-accent))"
                                fill="none"
                                strokeWidth="4"
                                strokeLinecap="round"
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
                                        fill="oklch(var(--color-text))"
                                    />
                                    <motion.circle
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                                        cx={p.x}
                                        cy={p.y}
                                        r="2"
                                        fill="oklch(var(--color-accent))"
                                    />
                                </g>
                            ))}

                            {labels.map((label, i) => {
                                const x = labels.length === 1 ? width / 2 : chartPaddingX + (i / (labels.length - 1)) * chartWidth;
                                return (
                                    <text
                                        key={i}
                                        x={x}
                                        y={height - 8}
                                        fontSize="12"
                                        textAnchor="middle"
                                        fill="oklch(var(--color-text-dim))"
                                        className="font-bold uppercase tracking-tighter"
                                    >
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
