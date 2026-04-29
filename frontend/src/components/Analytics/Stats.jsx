import { useState, useEffect } from "react";
import { MessageSquare, Smile, Zap, Clock } from "lucide-react";
import axios from "axios";
import { api } from "../../api/axios";
import { motion } from "framer-motion";

export default function Stats() {
    const [stats, setStats] = useState({
        totalConversations: 0,
        totalMessages: 0,
        satisfaction: null,
        responseTime: null,
        tokensUsed: 0,
        trend: 12,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [laravelRes, chatbotRes] = await Promise.all([
                    api.get("/dashboard"),
                    axios.get("http://127.0.0.1:8001/analytics/chatbot").catch(() => ({ data: {} })),
                ]);

                setStats((prev) => {
                    const next = { ...prev };

                    if (laravelRes.data?.metrics) {
                        const m = laravelRes.data.metrics;
                        next.totalConversations = m.conversations || 0;
                        next.totalMessages = m.total_messages || 0;
                        if (m.satisfaction !== undefined) next.satisfaction = m.satisfaction;
                        if (m.tokens !== undefined && m.tokens !== null) next.tokensUsed = m.tokens;
                        if (m.latency !== undefined) next.responseTime = m.latency;
                    }

                    if (chatbotRes.data?.stats) {
                        const cs = chatbotRes.data.stats;
                        if (cs.tokens_used != null && !Number.isNaN(Number(cs.tokens_used))) {
                            next.tokensUsed = Number(cs.tokens_used);
                        }
                    }

                    return next;
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num) => {
        if (num === null || num === undefined || Number.isNaN(num)) return "0";
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return Math.round(num).toString();
    };

    const safeStats = {
        totalConversations: Number(stats.totalConversations) || 0,
        totalMessages: Number(stats.totalMessages) || 0,
        satisfaction:
            stats.satisfaction === null || stats.satisfaction === undefined || Number.isNaN(Number(stats.satisfaction))
                ? null
                : Number(stats.satisfaction),
        responseTime:
            stats.responseTime === null || stats.responseTime === undefined || Number.isNaN(Number(stats.responseTime))
                ? null
                : Number(stats.responseTime),
        tokensUsed: Number(stats.tokensUsed) || 0,
        trend: Number(stats.trend) || 0,
    };

    const formatResponseTime = (value) => {
        if (value === null || value === undefined) return "--";
        return `${Number(value).toFixed(1)}s`;
    };

    const statCards = [
        {
            title: "Total Conversations",
            value: formatNumber(safeStats.totalConversations),
            icon: <MessageSquare size={18} />,
            color: "text-accent",
            bg: "bg-accent/10",
            borderColor: "border-accent/20",
            trend: safeStats.trend > 0 ? `+${safeStats.trend}%` : undefined,
            trendUp: true,
        },
        {
            title: "User Satisfaction",
            value: safeStats.satisfaction === null ? "--" : `${safeStats.satisfaction.toFixed(1)}/5.0`,
            icon: <Smile size={18} />,
            color: "text-success",
            bg: "bg-success/10",
            borderColor: "border-success/20",
            trend: "Stable",
            trendUp: null,
        },
        {
            title: "Avg Response Time",
            value: formatResponseTime(safeStats.responseTime),
            icon: <Clock size={18} />,
            color: "text-warning",
            bg: "bg-warning/10",
            borderColor: "border-warning/20",
            trend: "-15%",
            trendUp: true,
        },
        {
            title: "AI Tokens Used",
            value: formatNumber(safeStats.tokensUsed),
            icon: <Zap size={18} />,
            color: "text-accent",
            bg: "bg-accent/10",
            borderColor: "border-accent/20",
            trend: "+8%",
            trendUp: true,
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`group relative overflow-hidden rounded-[28px] border ${card.borderColor} bg-surface p-6 transition-colors duration-300`}
                >
                    <div className={`absolute inset-0 ${card.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                    <div className={`relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border ${card.borderColor} ${card.bg} ${card.color}`}>
                        {card.icon}
                    </div>

                    <p className="relative z-10 mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-muted">
                        {card.title}
                    </p>

                    <h3 className="relative z-10 text-3xl font-black tracking-tight text-text">
                        {card.value}
                    </h3>

                    {card.trend && (
                        <div className="relative z-10 mt-3 flex items-center gap-2">
                            <Clock size={12} className={card.trendUp ? "text-success" : "text-danger"} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.24em] ${card.trendUp ? "text-success" : "text-danger"}`}>
                                {card.trend} this week
                            </span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
