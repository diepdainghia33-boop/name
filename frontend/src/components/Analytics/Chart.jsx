import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

const timeRanges = [
    { label: "24h", value: "24h", days: 1 },
    { label: "7d", value: "7d", days: 7 },
    { label: "30d", value: "30d", days: 30 }
];

export default function Chart() {
    const [days, setDays] = useState([]);
    const [data, setData] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [timeRange, setTimeRange] = useState("7d");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const selectedRange = timeRanges.find(r => r.value === timeRange);
                const daysParam = selectedRange ? selectedRange.days : 7;

                const response = await axios.get(`http://127.0.0.1:8000/api/analytics?days=${daysParam}`);

                if (response.data?.data && Array.isArray(response.data.data)) {
                    setData(response.data.data);
                    setDays(
                        Array.isArray(response.data.days)
                            ? response.data.days
                            : generateDateLabels(daysParam)
                    );
                }
            } catch (error) {
                console.error("Error:", error);
                setData([12, 8, 15, 22, 18, 25, 30]);
                setDays(generateDateLabels(7));
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    const generateDateLabels = (daysCount) => {
        const labels = [];
        const today = new Date();

        if (daysCount === 1) {
            for (let h = 0; h < 24; h++) labels.push(`${h}:00`);
        } else if (daysCount <= 7) {
            for (let i = daysCount - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
            }
        } else {
            for (let i = daysCount - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
            }
        }

        return labels;
    };

    const width = 300;
    const height = 120;

    if (!data || data.length === 0) {
        return (
            <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f]">
                <div className="flex items-center justify-center h-56">
                    <p className="text-gray-500 text-sm">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const maxVal = Math.max(...data, 10);
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
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

    return (
        <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h4 className="text-lg font-bold text-white">Conversation Trends</h4>
                    <p className="text-xs text-gray-500">
                        {timeRange === "24h"
                            ? "Hourly (24h)"
                            : timeRange === "7d"
                                ? "Last 7 days"
                                : "Last 30 days"}
                    </p>
                </div>

                <div className="flex gap-2">
                    {timeRanges.map(r => (
                        <button
                            key={r.value}
                            onClick={() => setTimeRange(r.value)}
                            className={`px-3 py-1 rounded ${timeRange === r.value
                                ? "bg-blue-500 text-white"
                                : "bg-white/10 text-gray-400"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="flex justify-center items-center h-56 text-gray-500">
                    Loading...
                </div>
            ) : (
                <div className="h-56 w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                        <defs>
                            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <motion.path d={areaPath} fill="url(#gradientFill)" />
                        <motion.path d={linePath} stroke="#3b82f6" fill="none" strokeWidth="2" />

                        {points.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#60a5fa" />
                        ))}

                        {days.map((day, i) => {
                            const x = (i / (days.length - 1)) * width;
                            return (
                                <text key={i} x={x} y={height - 2} fontSize="8" textAnchor="middle" fill="#6b7280">
                                    {day}
                                </text>
                            );
                        })}
                    </svg>
                </div>
            )}
        </div>
    );
}