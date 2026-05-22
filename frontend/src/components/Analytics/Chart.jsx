import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../../api/axios";

const timeRanges = [
    { label: "24h", value: "24h", days: 1 },
    { label: "7d", value: "7d", days: 7 },
    { label: "30d", value: "30d", days: 30 }
];

const metricThemes = {
    conversations: {
        label: "Conversations",
        stroke: "hsl(var(--accent))",
        soft: "hsla(var(--accent), 0.2)",
    },
    responseTime: {
        label: "Response Time (s)",
        stroke: "#22c55e",
        soft: "rgba(34, 197, 94, 0.2)",
    },
    tokens: {
        label: "Tokens Used",
        stroke: "#eab308",
        soft: "rgba(234, 179, 8, 0.2)",
    },
};

export default function Chart() {
    const [days, setDays] = useState([]);
    const [data, setData] = useState([]);
    const [responseTimeData, setResponseTimeData] = useState([]);
    const [tokenData, setTokenData] = useState([]);
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

                const payload = response.data || {};
                setData(payload.data || []);
                setResponseTimeData(payload.responseTimeData || []);
                setTokenData(payload.tokenData || []);
                setDays(Array.isArray(payload.days) ? payload.days : generateDateLabels(daysParam));
            } catch (err) {
                console.error("Error loading analytics:", err);
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
            for (let hour = 0; hour < 24; hour += 1) {
                labels.push(`${hour}:00`);
            }
            return labels;
        }

        if (daysCount <= 7) {
            for (let i = daysCount - 1; i >= 0; i -= 1) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
            }
            return labels;
        }

        for (let i = daysCount - 1; i >= 0; i -= 1) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        }
        return labels;
    };

    const currentData = activeMetric === "conversations"
        ? data
        : activeMetric === "responseTime"
            ? responseTimeData
            : tokenData;

    const theme = metricThemes[activeMetric];
    const width = 300;
    const height = 120;

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

    const hasSeries = Array.isArray(currentData) && currentData.length > 0;
    const missingResponseTimes = activeMetric === "responseTime" && numericPoints.length === 0;

    if (loading) {
        return (
            <div className="col-span-12 lg:col-span-8 app-panel-strong p-6 md:p-8">
                <div className="flex h-56 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background-elevated/60">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                        <p className="text-sm text-text-muted">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !hasSeries) {
        return (
            <div className="col-span-12 lg:col-span-8 app-panel-strong p-6 md:p-8">
                <div className="flex h-56 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background-elevated/60">
                    <p className="text-sm text-text-muted">
                        {error || "Chưa có dữ liệu analytics. Hãy bắt đầu một cuộc trò chuyện."}
                    </p>
                </div>
            </div>
        );
    }

    if (missingResponseTimes) {
        return (
            <div className="col-span-12 lg:col-span-8 app-panel-strong p-6 md:p-8">
                <div className="flex h-56 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background-elevated/60">
                    <p className="text-sm text-text-muted">Chưa có dữ liệu thời gian phản hồi. Gửi tin nhắn để thu thập metrics.</p>
                </div>
            </div>
        );
    }

    const divisor = Math.max(currentData.length - 1, 1);
    const chartValues = numericPoints.length > 0 ? numericPoints.map(point => point.value) : currentData;
    const maxVal = Math.max(...chartValues, activeMetric === "conversations" ? 10 : 2);
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const chartPoints = numericPoints.map(({ index, value }) => ({
        index,
        value,
        x: (index / divisor) * width,
        y: height - value * scaleY - offsetY,
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
        return `M ${segment[0].x} ${segment[0].y} ${segment.slice(1).map((point, index) => {
            const prev = segment[index];
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
        <div className="col-span-12 lg:col-span-8 app-panel-strong p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h4 className="font-display text-lg font-bold text-text">{theme.label} Trends</h4>
                    <p className="text-xs uppercase tracking-[0.28em] text-text-dim">
                        {timeRange === "24h" ? "Hourly (24h)" : timeRange === "7d" ? "Last 7 days" : "Last 30 days"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-full border border-border/70 bg-surface p-1">
                        {["conversations", "responseTime", "tokens"].map((metric) => (
                            <button
                                key={metric}
                                onClick={() => setActiveMetric(metric)}
                                className={`rounded-full px-3 py-1.5 text-[0.625rem] font-black uppercase tracking-[0.2em] transition ${activeMetric === metric
                                    ? "bg-accent/15 text-accent"
                                    : "text-text-dim hover:text-text"
                                    }`}
                            >
                                {metric === "conversations" ? "Chat" : metric === "responseTime" ? "Time" : "Tokens"}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {timeRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${timeRange === range.value
                                    ? "bg-surface-strong text-text"
                                    : "bg-transparent text-text-dim hover:text-text"
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-64 w-full relative group/chart">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="analyticsChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme.stroke} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={theme.stroke} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={p}
                            x1="0"
                            y1={p * (height - offsetY * 2) + offsetY}
                            x2={width}
                            y2={p * (height - offsetY * 2) + offsetY}
                            stroke="hsl(var(--border) / 0.2)"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {segments.map((segment, segmentIndex) => (
                        <g key={segmentIndex}>
                            {buildAreaPath(segment) && (
                                <motion.path
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.5 }}
                                    d={buildAreaPath(segment)}
                                    fill="url(#analyticsChartGradient)"
                                />
                            )}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d={buildLinePath(segment)}
                                stroke={theme.stroke}
                                fill="none"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]"
                            />
                        </g>
                    ))}

                    {/* Interactive Hover Line */}
                    {hoverIndex !== null && hoverPoint && (
                        <motion.line
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            x1={hoverPoint.x}
                            y1="0"
                            x2={hoverPoint.x}
                            y2={height}
                            stroke={theme.stroke}
                            strokeWidth="1"
                            strokeDasharray="4 2"
                            className="pointer-events-none"
                        />
                    )}

                    {/* Data Points */}
                    {chartPoints.map((point) => (
                        <motion.circle
                            key={point.index}
                            initial={{ scale: 0 }}
                            animate={{ 
                                scale: hoverIndex === point.index ? 1.5 : (days.length > 10 ? 0.6 : 1),
                                opacity: days.length > 15 && hoverIndex !== point.index ? 0.4 : 1
                            }}
                            cx={point.x}
                            cy={point.y}
                            r={3}
                            fill="hsl(var(--background))"
                            stroke={theme.stroke}
                            strokeWidth="2"
                            onMouseEnter={() => setHoverIndex(point.index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className="cursor-pointer transition-all duration-200"
                        />
                    ))}

                    {/* Tooltip */}
                    {hoverIndex !== null && hoverPoint && (
                        <g className="pointer-events-none">
                            <rect
                                x={hoverPoint.x - 30}
                                y={hoverPoint.y - 40}
                                width="60"
                                height="24"
                                rx="8"
                                fill="hsl(var(--card))"
                                stroke="hsl(var(--border))"
                                strokeWidth="1"
                            />
                            <text
                                x={hoverPoint.x}
                                y={hoverPoint.y - 25}
                                fontSize="10"
                                fill="hsl(var(--foreground))"
                                textAnchor="middle"
                                className="font-black"
                            >
                                {currentData[hoverPoint.index]}
                                {activeMetric === "responseTime" ? "s" : ""}
                            </text>
                        </g>
                    )}

                    {/* X-Axis Labels */}
                    {days.map((day, index) => {
                        const step = days.length > 20 ? 5 : days.length > 10 ? 2 : 1;
                        if (index % step !== 0 && index !== days.length - 1) return null;

                        const x = (index / divisor) * width;
                        return (
                            <text
                                key={day + index}
                                x={x}
                                y={height + 15}
                                fontSize="8"
                                textAnchor="middle"
                                fill="hsl(var(--muted-foreground))"
                                className="font-bold uppercase opacity-60"
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
