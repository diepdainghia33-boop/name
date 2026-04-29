import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../api/axios";

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const describeSvgArc = (x, y, innerRadius, outerRadius, startAngle, endAngle) => {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z",
    ].join(" ");
};

export default function RightPanel() {
    const [intents, setIntents] = useState([
        { name: "Invoice Analysis", value: 35, color: "oklch(var(--color-accent))" },
        { name: "Architectural Consulting", value: 25, color: "oklch(var(--color-success))" },
        { name: "General Chat", value: 40, color: "oklch(var(--color-text-dim))" },
    ]);
    const [metrics, setMetrics] = useState({ health: null, latency: null });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("/analytics?days=7");
                if (response.data?.intents && Array.isArray(response.data.intents)) {
                    setIntents(response.data.intents);
                }
                if (response.data?.health !== undefined) {
                    setMetrics({
                        health: response.data.health,
                        latency: response.data.latency,
                    });
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchAnalytics();
    }, []);

    const total = intents.reduce((sum, intent) => sum + intent.value, 0);
    const centerX = 100;
    const centerY = 100;
    const innerRadius = 45;
    const outerRadius = 70;

    let currentAngle = 0;
    const slices = intents.map((item) => {
        const startAngle = currentAngle;
        const angle = (item.value / 100) * 360;
        currentAngle += angle;
        return {
            ...item,
            startAngle,
            endAngle: currentAngle,
        };
    });

    return (
        <div className="col-span-12 space-y-6 lg:col-span-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated p-6 transition-all duration-500"
            >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-[80px] transition-all duration-500 group-hover:bg-accent/15" />

                <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="mb-1 text-lg font-bold tracking-tight text-text">Intent Distribution</h3>
                            <p className="text-xs text-text-dim">Real-time classification</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface">
                            <span className="material-symbols-outlined text-accent">pie_chart</span>
                        </div>
                    </div>

                    <div className="mb-6 flex h-48 items-center justify-center">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            {slices.map((item, index) => (
                                <motion.path
                                    key={index}
                                    d={describeSvgArc(centerX, centerY, innerRadius, outerRadius, item.startAngle, item.endAngle)}
                                    fill={item.color}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    title={`${item.name}: ${item.value}%`}
                                />
                            ))}
                            <text
                                x={centerX}
                                y={centerY - 5}
                                textAnchor="middle"
                                className="text-lg font-black"
                                fill="oklch(var(--color-text))"
                            >
                                {total}%
                            </text>
                            <text
                                x={centerX}
                                y={centerY + 15}
                                textAnchor="middle"
                                className="text-[8px] uppercase tracking-wider"
                                fill="oklch(var(--color-text-dim))"
                            >
                                Coverage
                            </text>
                        </svg>
                    </div>

                    <div className="space-y-3">
                        {intents.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-medium text-text-muted">{item.name}</span>
                                </div>
                                <span className="text-xs font-bold text-text">{item.value}%</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated p-6 transition-all duration-500"
            >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-success/10 blur-[80px]" />

                <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface">
                            <span className="material-symbols-outlined text-success">circle</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-text">System Health</h3>
                            <p className="text-xs text-text-dim">All systems operational</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-border/70 bg-surface p-3">
                            <p className="text-[10px] uppercase text-text-dim">Uptime</p>
                            <p className="text-lg font-black text-success">
                                {metrics.health === null || metrics.health === undefined ? "--" : `${metrics.health}%`}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-surface p-3">
                            <p className="text-[10px] uppercase text-text-dim">Latency</p>
                            <p className="text-lg font-black text-accent">
                                {metrics.latency === null || metrics.latency === undefined ? "--" : `${Number(metrics.latency).toFixed(1)}s`}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
