import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "../../api/axios";

const timeRanges = [
    { label: "24h", value: "24h", days: 1 },
    { label: "7d", value: "7d", days: 7 },
    { label: "30d", value: "30d", days: 30 }
];

export default function Chart() {
    const [days, setDays] = useState([]);
    const [data, setData] = useState(null);
    const [responseTimeData, setResponseTimeData] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [activeMetric, setActiveMetric] = useState("conversations");
    const [hoverIndex, setHoverIndex] = useState(null);
    const [timeRange, setTimeRange] = useState("7d");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);
                const selectedRange = timeRanges.find(r => r.value === timeRange);
                const daysParam = selectedRange ? selectedRange.days : 7;

                const response = await api.get(`/analytics?days=${daysParam}`);

                if (response.data) {
                    setData(response.data.data || []);
                    setResponseTimeData(response.data.responseTimeData || []);
                    setTokenData(response.data.tokenData || []);
                    setDays(
                        Array.isArray(response.data.days)
                            ? response.data.days
                            : generateDateLabels(daysParam)
                    );
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Unable to load analytics data");
                setData([]);
                setResponseTimeData([]);
                setTokenData([]);
                setDays([]);
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

    const currentData = activeMetric === "conversations"
        ? data
        : activeMetric === "responseTime"
            ? responseTimeData
            : tokenData;

    const metricColor = activeMetric === "conversations"
        ? "#3b82f6"
        : activeMetric === "responseTime"
            ? "#22d3ee"
            : "#f59e0b";

    const metricLabel = activeMetric === "conversations"
        ? "Conversations"
        : activeMetric === "responseTime"
            ? "Response Time (s)"
            : "Tokens Used";

    const numericPoints = Array.isArray(currentData)
        ? currentData
            .map((value, index) => {
                if (value === null || value === undefined) return null;
                const numericValue = Number(value);
                if (Number.isNaN(numericValue)) return null;
                return { index, value: numericValue };
            })
            .filter(Boolean)
        : [];

    if (!currentData || currentData.length === 0 || (activeMetric === "responseTime" && numericPoints.length === 0)) {
        return (
            <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f]">
                <div className="flex items-center justify-center h-56">
                    <p className="text-gray-500 text-sm">
                        {error || (activeMetric === "responseTime" ? "No real response time data yet" : "Loading analytics...")}
                    </p>
                </div>
            </div>
        );
    }

    const chartValues = numericPoints.length > 0
        ? numericPoints.map(point => point.value)
        : currentData;
    const maxVal = Math.max(...chartValues, activeMetric === "conversations" ? 10 : 2);
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const chartPoints = numericPoints.map(({ index, value }) => ({
        index,
        value,
        x: currentData.length > 1 ? (index / (currentData.length - 1)) * width : width / 2,
        y: height - value * scaleY - offsetY
    }));

    const segments = [];
    let currentSegment = [];

    chartPoints.forEach((point) => {
        const previousPoint = currentSegment[currentSegment.length - 1];
        if (!previousPoint || point.index === previousPoint.index + 1) {
            currentSegment.push(point);
            return;
        }

        if (currentSegment.length > 0) {
            segments.push(currentSegment);
        }
        currentSegment = [point];
    });

    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }

    const buildLinePath = (segment) => {
        if (segment.length === 0) return null;
        return `M ${segment[0].x} ${segment[0].y} ${segment.slice(1).map((point, i) => {
            const prev = segment[i];
            const cx = (prev.x + point.x) / 2;
            return `C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
        }).join(" ")}`;
    };

    const buildAreaPath = (segment) => {
        if (segment.length < 2) return null;
        const linePath = buildLinePath(segment);
        if (!linePath) return null;
        return `${linePath} L ${segment[segment.length - 1].x} ${height} L ${segment[0].x} ${height} Z`;
    };

    const hoverPoint = hoverIndex !== null
        ? chartPoints.find(point => point.index === hoverIndex)
        : null;

    return (
        <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h4 className="text-lg font-bold text-white">{metricLabel} Trends</h4>
                        <p className="text-xs text-gray-500">
                            {timeRange === "24h"
                                ? "Hourly (24h)"
                                : timeRange === "7d"
                                    ? "Last 7 days"
                                    : "Last 30 days"}
                        </p>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveMetric("conversations")}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${activeMetric === "conversations" ? "bg-blue-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            CHAT
                        </button>
                        <button
                            onClick={() => setActiveMetric("responseTime")}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${activeMetric === "responseTime" ? "bg-cyan-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            TIME
                        </button>
                        <button
                            onClick={() => setActiveMetric("tokens")}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${activeMetric === "tokens" ? "bg-amber-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                        >
                            TOKENS
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    {timeRanges.map(r => (
                        <button
                            key={r.value}
                            onClick={() => setTimeRange(r.value)}
                            className={`px-3 py-1 rounded text-xs transition-all ${timeRange === r.value
                                ? "bg-white/10 text-white font-bold"
                                : "text-gray-500 hover:text-gray-300"
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
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                    Loading...
                </div>
            ) : (
                <div className="h-56 w-full">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                        <defs>
                            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={metricColor} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={metricColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {segments.map((segment, segmentIndex) => (
                            <g key={segmentIndex}>
                                {buildAreaPath(segment) && (
                                    <motion.path
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        d={buildAreaPath(segment)}
                                        fill="url(#gradientFill)"
                                    />
                                )}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.2 }}
                                    d={buildLinePath(segment)}
                                    stroke={metricColor}
                                    fill="none"
                                    strokeWidth="2"
                                />
                            </g>
                        ))}

                        {chartPoints.map((point) => (
                            <motion.circle
                                key={point.index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: point.index * 0.05 }}
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill={metricColor}
                                onMouseEnter={() => setHoverIndex(point.index)}
                                onMouseLeave={() => setHoverIndex(null)}
                                className="cursor-pointer"
                            />
                        ))}

                        {hoverPoint !== null && (
                            <g>
                                <line x1={hoverPoint.x} y1="0" x2={hoverPoint.x} y2={height} stroke="white" strokeOpacity="0.1" strokeDasharray="4" />
                                <text
                                    x={hoverPoint.x}
                                    y={hoverPoint.y - 10}
                                    fontSize="8"
                                    fill="white"
                                    textAnchor="middle"
                                    className="font-bold"
                                >
                                    {currentData[hoverPoint.index]}{activeMetric === "responseTime" ? "s" : ""}
                                </text>
                            </g>
                        )}

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
