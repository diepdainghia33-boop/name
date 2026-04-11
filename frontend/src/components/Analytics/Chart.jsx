import { motion } from "framer-motion";
import { useState } from "react";

export default function Chart() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = [65, 70, 55, 85, 50, 95, 80];

    const width = 300;
    const height = 120;

    const [hoverIndex, setHoverIndex] = useState(null);

    const scaleY = 0.7;
    const offsetY = 20;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - d * scaleY + offsetY;
        return { x, y };
    });

    // Smooth curve (Bezier đẹp hơn)
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

    return (
        <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f]">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h4 className="text-lg font-semibold text-white">
                        Conversation Trends
                    </h4>
                    <p className="text-sm text-gray-400">
                        Daily interaction volume
                    </p>
                </div>

                <div className="flex gap-2 text-xs">
                    {["7D", "30D", "90D"].map((t, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded-full transition ${t === "30D"
                                ? "bg-blue-500 text-white"
                                : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2a2a2a]"
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* CHART */}
            <div className="h-56 w-full relative">
                <svg
                    className="w-full h-full"
                    viewBox={`0 0 ${width} ${height}`}
                >
                    {/* GRID */}
                    {[20, 40, 60, 80, 100].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            x2={width}
                            y1={y}
                            y2={y}
                            stroke="#1f1f1f"
                            strokeWidth="0.6"
                        />
                    ))}

                    {/* GRADIENT */}
                    <defs>
                        <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>

                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* AREA */}
                    <motion.path
                        d={areaPath}
                        fill="url(#gradientFill)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* LINE GLOW */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="6"
                        filter="url(#glow)"
                        opacity="0.4"
                    />

                    {/* LINE */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.6, ease: "easeInOut" }}
                    />

                    {/* DOTS */}
                    {points.map((p, i) => (
                        <g
                            key={i}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <motion.circle
                                cx={p.x}
                                cy={p.y}
                                r={hoverIndex === i ? 6 : 3}
                                fill="#93c5fd"
                                animate={{ scale: hoverIndex === i ? 1.3 : 1 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    filter: "drop-shadow(0 0 8px #3b82f6)"
                                }}
                            />

                            {/* TOOLTIP */}
                            {hoverIndex === i && (
                                <foreignObject
                                    x={p.x - 30}
                                    y={p.y - 40}
                                    width="60"
                                    height="30"
                                >
                                    <div className="bg-black text-white text-xs px-2 py-1 rounded-lg text-center shadow">
                                        {data[i]}
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    ))}

                    {/* LABELS */}
                    {days.map((day, i) => {
                        const x = (i / (days.length - 1)) * width;
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - 2}
                                textAnchor="middle"
                                fontSize="8"
                                fill="#6b7280"
                            >
                                {day}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}