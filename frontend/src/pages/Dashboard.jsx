import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock3, Layers3, ShieldCheck, Sparkles, X } from "lucide-react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Metrics from "../components/Dashboard/Metrics";
import BlueprintCard from "../components/Dashboard/BlueprintCard";
import DashboardHeader from "../components/Dashboard/Header";
import SystemStatusWidget from "../components/Dashboard/SystemStatusWidget";
import ActivityLogWidget from "../components/Dashboard/ActivityLogWidget";
import ConversationTrends from "../components/Dashboard/ConversationTrends";
import BlueprintTrend from "../components/Dashboard/BlueprintTrend";
import ActivityTrend from "../components/Dashboard/ActivityTrend";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [metrics, setMetrics] = useState({
        health: null,
        tokens: 0,
        total_messages: 0
    });

    const [logs, setLogs] = useState([]);
    const [blueprints, setBlueprints] = useState([]);
    const [trends, setTrends] = useState([]);
    const [blueprintTrends, setBlueprintTrends] = useState([]);
    const [activityTrends, setActivityTrends] = useState([]);
    const [lastSyncTime, setLastSyncTime] = useState(new Date());
    const [welcomeBanner, setWelcomeBanner] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        let parsedUser = null;

        if (storedUser) {
            try {
                parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }

        const welcomePayload = sessionStorage.getItem("dashboard_welcome");
        if (welcomePayload) {
            try {
                const parsedWelcome = JSON.parse(welcomePayload);
                setWelcomeBanner({
                    name: parsedWelcome.name || parsedUser?.name || "Architect",
                    message: parsedWelcome.message || "Your command center is live. Everything is synced for this session."
                });
            } catch (error) {
                setWelcomeBanner({
                    name: parsedUser?.name || "Architect",
                    message: "Your command center is live. Everything is synced for this session."
                });
            } finally {
                sessionStorage.removeItem("dashboard_welcome");
            }
        }

        const cache = localStorage.getItem("dashboard_cache");
        if (cache) {
            const data = JSON.parse(cache);
            setBlueprints(data.blueprints || []);
            setLogs(data.logs || []);
            setMetrics(data.metrics || {});
            setTrends(data.trends || []);
            setBlueprintTrends(data.blueprintTrends || []);
            setActivityTrends(data.activityTrends || []);
            setIsLoading(false);
        }

        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!welcomeBanner) return;

        const timer = window.setTimeout(() => {
            setWelcomeBanner(null);
        }, 6500);

        return () => window.clearTimeout(timer);
    }, [welcomeBanner]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [dashboardRes] = await Promise.allSettled([
                axios.get("http://127.0.0.1:8000/api/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 4000
                })
            ]);

            const dashboardData =
                dashboardRes.status === "fulfilled" ? dashboardRes.value.data : {};

            const { blueprints = [], logs = [], metrics = {}, trends = [], blueprintTrends = [], activityTrends = [] } = dashboardData;

            const mappedLogs = logs.map(l => ({
                id: l.id,
                message: l.message,
                type: l.type,
                time: new Date(l.created_at).toLocaleTimeString()
            }));

            const mergedMetrics = {
                ...metrics,
            };

            setBlueprints(blueprints);
            setLogs(mappedLogs);
            setMetrics(mergedMetrics);
            setTrends(trends);
            setBlueprintTrends(blueprintTrends);
            setActivityTrends(activityTrends);
            setLastSyncTime(new Date());
            setIsLoading(false);

            localStorage.setItem("dashboard_cache", JSON.stringify({
                blueprints,
                logs: mappedLogs,
                metrics: mergedMetrics,
                trends,
                blueprintTrends,
                activityTrends
            }));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setIsLoading(false);
        }
    };

    const addLog = async (message, type = "info") => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/dashboard/log",
                { message, type },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newLog = {
                id: response.data.id,
                message: response.data.message,
                type: response.data.type,
                time: new Date(response.data.created_at).toLocaleTimeString()
            };

            setLogs(prev => [newLog, ...prev]);
        } catch (error) {
            console.error("Error adding log:", error);
        }
    };

    const formattedMetrics = useMemo(() => ({
        ...metrics,
        tokens: typeof metrics.tokens === 'number' ? metrics.tokens.toLocaleString() : metrics.tokens || 0,
        total_messages: metrics.total_messages || 0
    }), [metrics]);

    const overviewStats = useMemo(() => ([
        {
            label: "Blueprints",
            value: blueprints.length,
            icon: Layers3,
            tone: "bg-accent/10 text-accent border-accent/20"
        },
        {
            label: "Recent Events",
            value: logs.length,
            icon: Clock3,
            tone: "from-warning/20 to-background/5 text-warning border-warning/20"
        },
        {
            label: "Health Score",
            value: metrics.health === null || metrics.health === undefined ? "--" : `${metrics.health}%`,
            icon: ShieldCheck,
            tone: "from-success/20 to-background/5 text-success border-success/20"
        }
    ]), [blueprints.length, logs.length, metrics.health]);

    const welcomeHighlights = [
        {
            label: "Workspace",
            value: "Ready",
            icon: Layers3
        },
        {
            label: "Session",
            value: "Secure",
            icon: ShieldCheck
        },
        {
            label: "Signal",
            value: "Live",
            icon: Sparkles
        }
    ];

    return (
        <div className="app-shell flex min-h-screen bg-background text-text">
            <SidebarLeft user={user} />

            <main className="ml-72 flex-1">
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,oklch(var(--color-accent))_10%,transparent),transparent_24%),radial-gradient(circle_at_20%_20%,color-mix(in_oklch,oklch(var(--color-success))_8%,transparent),transparent_22%),linear-gradient(180deg,oklch(var(--color-background))_0%,oklch(var(--color-background-elevated))_45%,oklch(var(--color-background))_100%)]" />

                <div className="sticky top-0 z-40 bg-background/65 px-4 pt-4 backdrop-blur-xl lg:px-6">
                    <DashboardHeader />
                </div>

                <div className="relative mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
                    <AnimatePresence>
                        {welcomeBanner && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    onClick={() => setWelcomeBanner(null)}
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.28),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.16),transparent_22%),linear-gradient(180deg,rgba(3,7,18,0.82),rgba(3,7,18,0.94))] backdrop-blur-xl"
                                />

                                <motion.div
                                    aria-modal="true"
                                    role="dialog"
                                    initial={{ opacity: 0, y: 34, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 24, scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                                    className="relative w-full max-w-6xl overflow-hidden rounded-[40px] border border-border/70 bg-background-elevated/95 shadow-[0_50px_180px_rgba(0,0,0,0.8)] max-h-[calc(100vh-2rem)]"
                                >
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.07),transparent_34%)]" />
                                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:32px_32px]" />
                                    <motion.div
                                        animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                        className="pointer-events-none absolute -top-24 left-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"
                                    />
                                    <motion.div
                                        animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
                                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                                        className="pointer-events-none absolute right-8 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
                                    />

                                    <div className="grid max-h-[calc(100vh-2rem)] overflow-auto lg:grid-cols-[1.2fr_0.8fr]">
                                        <div className="relative p-6 sm:p-8 lg:p-12">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-accent">
                                                    <ShieldCheck size={14} />
                                                    Secure session established
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setWelcomeBanner(null)}
                                                    className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 bg-surface px-4 text-xs font-black uppercase tracking-[0.25em] text-text transition hover:bg-surface-strong"
                                                >
                                                    <X size={14} className="mr-2" />
                                                    Close
                                                </button>
                                            </div>

                                            <div className="mt-8 max-w-3xl">
                                                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-accent/80">
                                                    Signed in successfully
                                                </p>
                                                <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-7xl">
                                                    Welcome back,
                                                    <span className="mt-3 block text-accent">
                                                        {welcomeBanner.name}
                                                    </span>
                                                </h2>
                                                <p className="mt-6 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                                                    {welcomeBanner.message}
                                                </p>
                                                <p className="mt-4 max-w-2xl text-sm leading-7 text-text-dim sm:text-base">
                                                    Your command center is live. Analytics, blueprints, and system signals are ready for you to take over.
                                                </p>
                                            </div>

                                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                                {welcomeHighlights.map(({ label, value, icon: Icon }) => (
                                                    <div
                                                        key={label}
                                                        className="rounded-[24px] border border-border/70 bg-surface p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                                    >
                                                        <div className="mb-6 flex items-center justify-between">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
                                                                {label}
                                                            </span>
                                                            <Icon size={16} className="text-accent" />
                                                        </div>
                                                        <p className="text-2xl font-black tracking-tight text-text">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-10 flex flex-wrap gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setWelcomeBanner(null)}
                                                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-background transition hover:scale-[1.02] hover:bg-accent-strong"
                                                >
                                                    Enter dashboard
                                                    <ArrowUpRight size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setWelcomeBanner(null)}
                                                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-text transition hover:bg-surface-strong"
                                                >
                                                    Explore system pulse
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative border-t border-border/70 bg-surface-muted p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                                            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-text-dim">
                                                            Command Center
                                                        </p>
                                                        <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.25em] text-success">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                                                            Live
                                                        </span>
                                                    </div>

                                                    <div className="rounded-[32px] border border-border/70 bg-surface p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-8">
                                                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.25em] text-text-dim">
                                                            <span>System handoff</span>
                                                            <span>Now</span>
                                                        </div>

                                                        <div className="mt-8 flex items-center justify-center">
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                                                                className="relative flex h-56 w-56 items-center justify-center rounded-full border border-accent/20 bg-[radial-gradient(circle,oklch(var(--color-accent)/0.18)_0%,oklch(var(--color-background-elevated)/0.08)_42%,transparent_74%)]"
                                                            >
                                                                <div className="absolute inset-7 rounded-full border border-border/70" />
                                                                <div className="absolute inset-0 rounded-full border border-accent/15" />
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.06, 1] }}
                                                                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                                                                    className="relative flex h-28 w-28 items-center justify-center rounded-full border border-border/70 bg-background-elevated shadow-[0_0_80px_rgba(0,0,0,0.25)]"
                                                                >
                                                                    <Sparkles size={34} className="text-accent" />
                                                                </motion.div>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="rounded-[22px] border border-border/70 bg-surface p-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
                                                            Session
                                                        </p>
                                                        <p className="mt-2 text-sm font-bold text-text">
                                                            Fully authenticated
                                                        </p>
                                                    </div>
                                                    <div className="rounded-[22px] border border-border/70 bg-surface p-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">
                                                            Sync
                                                        </p>
                                                        <p className="mt-2 text-sm font-bold text-text">
                                                            Dashboard ready
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="grid gap-8 xl:grid-cols-[1fr_380px]">
                        {/* 🔹 MAIN CONTENT COLUMN */}
                        <div className="space-y-8">
                            {/* Hero Section */}
                            <div className="overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                                <div className="grid gap-8 p-6 lg:grid-cols-[1fr_320px] lg:p-8">
                                    <div className="space-y-6">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                                            Live Intelligence
                                        </div>
                                        <div className="space-y-3">
                                            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                                                Welcome, <span className="text-accent">{user?.name || "Architect"}</span>
                                            </h1>
                                            <p className="max-w-2xl text-sm leading-7 text-text-muted">
                                                Your neural network is operating at peak efficiency. Review the latest system patterns and architectural outputs below.
                                            </p>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            {overviewStats.map(({ label, value, icon: Icon, tone }) => (
                                                <div key={label} className={`rounded-2xl border bg-gradient-to-br p-4 ${tone}`}>
                                                    <div className="mb-6 flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
                                                        <Icon size={16} />
                                                    </div>
                                                    <p className="text-2xl font-black tracking-tight text-white">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex h-full flex-col justify-between rounded-[28px] border border-border/70 bg-surface p-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-dim">Last Sync</p>
                                            <p className="mt-3 text-lg font-bold text-white">
                                                {lastSyncTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                            </p>
                                            <p className="mt-1 text-[10px] text-text-dim uppercase tracking-widest font-black">
                                                {lastSyncTime.toLocaleDateString("vi-VN")}
                                            </p>
                                            <p className="mt-2 text-xs leading-relaxed text-text-dim italic">
                                                "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                                            </p>
                                        </div>
                                        <button className="flex w-full items-center justify-between rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-left transition hover:bg-accent/15">
                                            <span className="text-xs font-bold uppercase tracking-widest text-text">New Blueprint</span>
                                            <ArrowUpRight size={16} className="text-accent" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-24 opacity-20">
                                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">Synching Neural Data...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Primary Trends & Metrics */}
                                    <div className="grid gap-8 lg:grid-cols-1">
                                        <ConversationTrends trends={trends} />
                                        
                                        <section className="rounded-[32px] border border-border/70 bg-background-elevated p-8 shadow-2xl">
                                            <div className="mb-8 flex items-center justify-between">
                                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Core Analytics</h2>
                                                <div className="h-1 w-12 rounded-full bg-accent" />
                                            </div>
                                            <Metrics data={formattedMetrics} />
                                        </section>

                                        <div className="grid gap-8 lg:grid-cols-1">
                                            <div className="space-y-6">
                                                <div className="flex items-end justify-between px-2">
                                                    <div>
                                                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Recent Blueprints</h2>
                                                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-text-dim">Architecture Library</p>
                                                    </div>
                                                </div>
                                                <BlueprintTrend data={blueprintTrends} />
                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                                                    {blueprints.length === 0 ? (
                                                        <div className="col-span-full rounded-3xl border border-dashed border-border/70 bg-surface py-16 text-center text-sm uppercase tracking-widest text-text-dim">
                                                            No schematics found
                                                        </div>
                                                    ) : (
                                                        blueprints.map(bp => (
                                                            <BlueprintCard
                                                                key={bp.id}
                                                                title={bp.title}
                                                                onClick={() => addLog(`Accessed: ${bp.title}`, bp.type)}
                                                            />
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 🔹 SIDEBAR COLUMN */}
                        <aside className="space-y-8">
                            <div className="sticky top-24 space-y-8">
                                <section className="overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated shadow-2xl">
                                    <SystemStatusWidget health={metrics.health} />
                                </section>
                                
                                <div className="space-y-4">
                                    <div className="px-2">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim">Operational Log</h3>
                                    </div>
                                    <ActivityTrend data={activityTrends} />
                                    <section className="overflow-hidden rounded-[32px] border border-border/70 bg-background-elevated shadow-2xl">
                                        <ActivityLogWidget logs={logs} />
                                    </section>
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}
