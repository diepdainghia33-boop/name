import { motion } from "framer-motion";
import { Box, Layers, TrendingUp } from "lucide-react";

export default function BlueprintTrend({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background-elevated/60 text-xs uppercase tracking-[0.24em] text-text-dim">
                Analyzing architecture patterns...
            </div>
        );
    }

    const counts = data.map((entry) => entry.count);
    const labels = data.map((entry) => entry.day);
    const width = 600;
    const height = 160;
    const maxVal = Math.max(...counts, 5);
    const scaleY = (height - 60) / maxVal;
    const offsetY = 30;

    const points = counts.map((value, index) => ({
        x: (index / Math.max(counts.length - 1, 1)) * width,
        y: height - value * scaleY - offsetY,
    }));

    const linePath = points.length > 0
        ? `M ${points[0].x} ${points[0].y} ${points.slice(1).map((point, index) => {
            const prev = points[index];
            const cx = (prev.x + point.x) / 2;
            return `C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
        }).join(" ")}`
        : "";

    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
    const total = counts.reduce((sum, value) => sum + value, 0);
    const peak = Math.max(...counts);

    return (
        <div className="group relative overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated p-1 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-accent/10 blur-[80px] transition-all group-hover:bg-accent/15" />

            <div className="relative flex flex-col gap-8 p-6 lg:flex-row lg:p-8">
                <div className="flex flex-row justify-between gap-6 lg:flex-col lg:justify-center lg:border-r lg:border-border/70 lg:pr-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                            <Box size={10} /> Created
                        </div>
                        <p className="text-3xl font-black text-text">{total}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-success">
                            <TrendingUp size={10} /> Daily Peak
                        </div>
                        <p className="text-3xl font-black text-text">{peak}</p>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-text">
                            <Layers size={20} className="text-accent" /> Blueprint Output
                        </h2>
                        <p className="text-xs text-text-dim">Architecture creation frequency</p>
                    </div>

                    <div className="h-32 w-full">
                        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="blueprintTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="oklch(var(--color-accent))" stopOpacity="0.28" />
                                    <stop offset="100%" stopColor="oklch(var(--color-accent))" stopOpacity="0" />
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
                                stroke="oklch(var(--color-accent))"
                                fill="none"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_10px_rgba(0,0,0,0.18)]"
                            />

                            {points.map((point, index) => (
                                <motion.circle
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                                    cx={point.x}
                                    cy={point.y}
                                    r="4"
                                    fill="oklch(var(--color-background))"
                                    stroke="oklch(var(--color-accent))"
                                    strokeWidth="2"
                                />
                            ))}

                            {labels.map((label, index) => {
                                const x = (index / Math.max(labels.length - 1, 1)) * width;
                                return (
                                    <text
                                        key={label + index}
                                        x={x}
                                        y={height - 5}
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
