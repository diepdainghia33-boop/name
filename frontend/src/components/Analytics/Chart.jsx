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
        stroke: "oklch(var(--color-accent))",
        soft: "oklch(var(--color-accent-soft))",
    },
    responseTime: {
        label: "Response Time (s)",
        stroke: "oklch(var(--color-success))",
        soft: "oklch(var(--color-success) / 0.25)",
    },
    tokens: {
        label: "Tokens Used",
        stroke: "oklch(var(--color-warning))",
        soft: "oklch(var(--color-warning) / 0.24)",
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

    if (loading || !currentData || currentData.length === 0 || (activeMetric === "responseTime" && numericPoints.length === 0)) {
        return (
            <div className="col-span-12 lg:col-span-8 app-panel-strong p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h4 className="font-display text-lg font-bold text-text">Analytics Trends</h4>
                        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-text-dim">
                            {timeRange === "24h" ? "Hourly" : timeRange === "7d" ? "Last 7 days" : "Last 30 days"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {timeRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition ${timeRange === range.value
                                    ? "bg-accent/15 text-accent"
                                    : "bg-surface text-text-dim hover:text-text"
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex h-56 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background-elevated/60">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                        <p className="text-sm text-text-muted">
                            {error || "Loading analytics..."}
                        </p>
                    </div>
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
                                className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition ${activeMetric === metric
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

            <div className="h-56 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="analyticsChartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={theme.soft} stopOpacity="1" />
                            <stop offset="100%" stopColor={theme.soft} stopOpacity="0" />
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
                                    fill="url(#analyticsChartGradient)"
                                />
                            )}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2 }}
                                d={buildLinePath(segment)}
                                stroke={theme.stroke}
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
                            fill={theme.stroke}
                            onMouseEnter={() => setHoverIndex(point.index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className="cursor-pointer"
                        />
                    ))}

                    {hoverPoint && (
                        <g>
                            <line x1={hoverPoint.x} y1="0" x2={hoverPoint.x} y2={height} stroke="oklch(var(--color-border-strong))" strokeDasharray="4" />
                            <text
                                x={hoverPoint.x}
                                y={hoverPoint.y - 10}
                                fontSize="8"
                                fill={theme.stroke}
                                textAnchor="middle"
                                className="font-bold"
                            >
                                {currentData[hoverPoint.index]}
                                {activeMetric === "responseTime" ? "s" : ""}
                            </text>
                        </g>
                    )}

                    {days.map((day, index) => {
                        const x = (index / Math.max(days.length - 1, 1)) * width;
                        return (
                            <text
                                key={day + index}
                                x={x}
                                y={height - 2}
                                fontSize="8"
                                textAnchor="middle"
                                fill="oklch(var(--color-text-dim))"
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
