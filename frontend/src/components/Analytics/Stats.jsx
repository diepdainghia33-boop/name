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
        trend: 12
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [laravelRes, chatbotRes] = await Promise.all([
                    api.get("/dashboard"),
                    axios.get("http://127.0.0.1:8001/analytics/chatbot").catch(() => ({ data: {} }))
                ]);

                setStats(prev => {
                    const newStats = { ...prev };

                    // Data from Laravel
                    if (laravelRes.data?.metrics) {
                        const m = laravelRes.data.metrics;
                        newStats.totalConversations = m.conversations || 0;
                        newStats.totalMessages = m.total_messages || 0;
                        if (m.satisfaction !== undefined) newStats.satisfaction = m.satisfaction;
                        if (m.tokens !== undefined && m.tokens !== null) newStats.tokensUsed = m.tokens;
                        if (m.latency !== undefined) newStats.responseTime = m.latency;
                    }

                    // Safely extract chatbot stats from AI service (fallback/override if active)
                    if (chatbotRes.data?.stats) {
                        const cs = chatbotRes.data.stats;
                        if (cs.tokens_used != null && !isNaN(cs.tokens_used)) {
                            newStats.tokensUsed = Number(cs.tokens_used);
                        }
                    }

                    return newStats;
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
        if (num === null || num === undefined || isNaN(num)) return "0";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return Math.round(num).toString();
    };

    // Ensure all values are numbers
    const safeStats = {
        totalConversations: Number(stats.totalConversations) || 0,
        totalMessages: Number(stats.totalMessages) || 0,
        satisfaction: stats.satisfaction === null || stats.satisfaction === undefined || Number.isNaN(Number(stats.satisfaction))
            ? null
            : Number(stats.satisfaction),
        responseTime: stats.responseTime === null || stats.responseTime === undefined || Number.isNaN(Number(stats.responseTime))
            ? null
            : Number(stats.responseTime),
        tokensUsed: Number(stats.tokensUsed) || 0,
        trend: Number(stats.trend) || 0
    };

    const formatResponseTime = (value) => {
        if (value === null || value === undefined) return "--";
        return `${Number(value).toFixed(1)}s`;
    };

    const statCards = [
        {
            title: "Total Conversations",
            value: formatNumber(safeStats.totalConversations),
            icon: <MessageSquare size={20} />,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            trend: safeStats.trend > 0 ? `+${safeStats.trend}%` : undefined,
            trendUp: true
        },
        {
            title: "User Satisfaction",
            value: safeStats.satisfaction === null ? "--" : `${safeStats.satisfaction.toFixed(1)}/5.0`,
            icon: <Smile size={20} />,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
            trend: "Stable",
            trendUp: null
        },
        {
            title: "Avg Response Time",
            value: formatResponseTime(safeStats.responseTime),
            icon: <Clock size={20} />,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            borderColor: "border-cyan-500/20",
            trend: "-15%",
            trendUp: true
        },
        {
            title: "AI Tokens Used",
            value: formatNumber(safeStats.tokensUsed),
            icon: <Zap size={20} />,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            trend: "+8%",
            trendUp: true
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-2xl border ${card.borderColor} hover:border-opacity-50 transition-all duration-300 overflow-hidden group`}
                >
                    {/* Glow effect on hover */}
                    <div className={`absolute inset-0 ${card.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 relative z-10`}>
                        <div className={card.color}>{card.icon}</div>
                    </div>

                    {/* Title */}
                    <p className="text-xs font-['Space_Grotesk'] uppercase tracking-[0.2em] text-[#adaaaa] mb-2">
                        {card.title}
                    </p>

                    {/* Value */}
                    <h3 className="text-3xl font-black tracking-tighter text-white mb-1">
                        {card.value}
                    </h3>

                    {/* Trend */}
                    {card.trend && (
                        <div className="flex items-center gap-2 mt-2">
                            <Clock size={12} className={card.trendUp ? "text-green-400" : "text-red-400"} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${card.trendUp ? "text-green-400" : "text-red-400"}`}>
                                {card.trend} this week
                            </span>
                        </div>
                    )}

                    {/* Subtle animated line bottom */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        style={{
                            background: `linear-gradient(90deg, transparent, ${card.color.match(/#[0-9a-fA-F]+/)?.[0] || '#ffffff'}, transparent)`
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
