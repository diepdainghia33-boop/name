import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

// Helper to convert polar to cartesian
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

// Helper to create donut slice path
const describeSvgArc = (x, y, innerRadius, outerRadius, startAngle, endAngle) => {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");

    return d;
};

export default function RightPanel() {
    const [intents, setIntents] = useState([
        { name: "Invoice Analysis", value: 35, color: "#60a5fa" },
        { name: "Architectural Consulting", value: 25, color: "#f472b6" },
        { name: "General Chat", value: 40, color: "#9ca3af" },
    ]);

    useEffect(() => {
        const fetchIntents = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8001/api/analytics");
                if (response.data?.intents && Array.isArray(response.data.intents)) {
                    setIntents(response.data.intents);
                }
            } catch (error) {
                console.error("Error fetching intents:", error);
            }
        };
        fetchIntents();
    }, []);

    const total = intents.reduce((sum, i) => sum + i.value, 0);
    const centerX = 100, centerY = 100;
    const innerRadius = 45, outerRadius = 70;

    // Calculate slices with angles
    let currentAngle = 0;
    const slices = intents.map(item => {
        const startAngle = currentAngle;
        const angle = (item.value / 100) * 360;
        currentAngle += angle;
        return {
            ...item,
            startAngle,
            endAngle: currentAngle
        };
    });

    return (
        <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Intent Distribution Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-[#0f0f0f] to-black/40 p-6 rounded-2xl border border-white/5 hover:border-[#85adff]/20 transition-all duration-500 relative overflow-hidden group"
            >
                {/* Background glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#85adff]/5 blur-[80px] rounded-full group-hover:bg-[#85adff]/10 transition-all duration-500" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight mb-1">Intent Distribution</h3>
                            <p className="text-xs text-gray-500">Real-time classification</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#85adff]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#85adff]">pie_chart</span>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="relative h-48 mb-6 flex items-center justify-center">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            {slices.map((item, i) => {
                                const path = describeSvgArc(centerX, centerY, innerRadius, outerRadius, item.startAngle, item.endAngle);

                                return (
                                    <motion.path
                                        key={i}
                                        d={path}
                                        fill={item.color}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        title={`${item.name}: ${item.value}%`}
                                    />
                                );
                            })}
                            {/* Center label */}
                            <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-lg font-black fill-white">{total}%</text>
                            <text x={centerX} y={centerY + 15} textAnchor="middle" className="text-[8px] fill-gray-500 uppercase tracking-wider">Coverage</text>
                        </svg>
                    </div>

                    {/* Intent List */}
                    <div className="space-y-3">
                        {intents.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-gray-300 font-medium">{item.name}</span>
                                </div>
                                <span className="text-xs font-bold text-white">{item.value}%</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Real-time Status Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#0f0f0f] to-black/40 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-400">circle</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">System Health</h3>
                            <p className="text-xs text-gray-500">All systems operational</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase">Uptime</p>
                            <p className="text-lg font-black text-emerald-400">99.9%</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase">Latency</p>
                            <p className="text-lg font-black text-blue-400">45ms</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
