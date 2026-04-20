import { useState, useEffect, useMemo } from "react";
import { ArrowUpRight, Clock3, Layers3, ShieldCheck } from "lucide-react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Metrics from "../components/Dashboard/Metrics";
import BlueprintCard from "../components/Dashboard/BlueprintCard";
import SettingsHeader from "../components/Dashboard/SettingsHeader";
import SystemStatusWidget from "../components/Dashboard/SystemStatusWidget";
import ActivityLogWidget from "../components/Dashboard/ActivityLogWidget";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [metrics, setMetrics] = useState({
        health: 0,
        tokens: 0,
        total_messages: 0
    });

    const [logs, setLogs] = useState([]);
    const [blueprints, setBlueprints] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const cache = localStorage.getItem("dashboard_cache");
        if (cache) {
            const data = JSON.parse(cache);
            setBlueprints(data.blueprints || []);
            setLogs(data.logs || []);
            setMetrics(data.metrics || {});
            setIsLoading(false);
        }

        fetchDashboardData();
    }, []);

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

            const { blueprints = [], logs = [], metrics = {} } = dashboardData;

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
            setIsLoading(false);

            localStorage.setItem("dashboard_cache", JSON.stringify({
                blueprints,
                logs: mappedLogs,
                metrics: mergedMetrics
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
            tone: "from-cyan-500/20 to-blue-500/5 text-cyan-300 border-cyan-400/20"
        },
        {
            label: "Recent Events",
            value: logs.length,
            icon: Clock3,
            tone: "from-amber-500/20 to-orange-500/5 text-amber-300 border-amber-400/20"
        },
        {
            label: "Health Score",
            value: `${metrics.health || 0}%`,
            icon: ShieldCheck,
            tone: "from-emerald-500/20 to-green-500/5 text-emerald-300 border-emerald-400/20"
        }
    ]), [blueprints.length, logs.length, metrics.health]);

    return (
        <div className="flex min-h-screen bg-[#0e0e0e] text-white">
            <SidebarLeft user={user} />

            <main className="ml-72 flex-1">
                <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_24%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_22%),linear-gradient(180deg,#0b0b0b_0%,#0e0e0e_45%,#090909_100%)]" />

                <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0b0b0b]/80 px-6 backdrop-blur-xl lg:px-8">
                    <SettingsHeader user={user} toggleSidebar={() => {}} rightOpen={false} />
                </div>

                <div className="relative mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
                        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                            <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.3fr)_320px] lg:p-8">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">
                                        Live overview
                                    </div>
                                    <div className="space-y-3">
                                        <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
                                            Operations dashboard for <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">{user?.name || "Architect"}</span>
                                        </h1>
                                        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                            Track system health, recent blueprints, and operational activity in a more focused dashboard layout.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        {overviewStats.map(({ label, value, icon: Icon, tone }) => (
                                            <div
                                                key={label}
                                                className={`rounded-2xl border bg-gradient-to-br p-4 ${tone}`}
                                            >
                                                <div className="mb-8 flex items-center justify-between">
                                                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/60">{label}</span>
                                                    <Icon size={18} />
                                                </div>
                                                <p className="text-3xl font-black tracking-tight text-white">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-[#111111] p-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-400">Control center</p>
                                        <h2 className="mt-3 text-2xl font-bold text-white">Workspace status</h2>
                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            Data is cached locally for faster loading, then refreshed when the dashboard API responds.
                                        </p>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-left transition hover:border-blue-400/40 hover:bg-blue-500/15"
                                        >
                                            <span>
                                                <span className="block text-sm font-bold text-white">Review latest blueprints</span>
                                                <span className="mt-1 block text-xs text-slate-300">Tap into recent architecture activity</span>
                                            </span>
                                            <ArrowUpRight size={18} className="text-blue-300" />
                                        </button>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">Last sync</p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                {new Date().toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                })}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">Cached snapshot ready for fallback rendering.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <SystemStatusWidget />
                            <ActivityLogWidget logs={logs.slice(0, 5)} />
                        </div>
                    </section>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 opacity-20">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">Loading...</p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_360px]">
                            <div className="space-y-8">
                                <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:p-8">
                                    <div className="mb-6 flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Performance</p>
                                            <h2 className="mt-2 text-2xl font-bold text-white">Core metrics</h2>
                                        </div>
                                        <p className="max-w-sm text-right text-sm text-slate-400">
                                            Core metrics now sit in one dedicated block for faster scanning when the dashboard opens.
                                        </p>
                                    </div>
                                    <Metrics data={formattedMetrics} />
                                </section>

                                <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:p-8">
                                    <div className="mb-8 flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Library</p>
                                            <h2 className="mt-2 text-2xl font-bold text-white">Recent blueprints</h2>
                                        </div>
                                        <p className="max-w-sm text-right text-sm text-slate-400">
                                            Review the latest blueprint cards here and keep logging when each item is opened.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                                        {blueprints.length === 0 ? (
                                            <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-black/20 py-16 text-center text-sm text-slate-500">
                                                No blueprint data available
                                            </div>
                                        ) : (
                                            blueprints.map(bp => (
                                                <BlueprintCard
                                                    key={bp.id}
                                                    title={bp.title}
                                                    onClick={() => addLog(`Accessed blueprint: ${bp.title}`, bp.type)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-8 xl:sticky xl:top-24 xl:h-fit">
                                <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                                    <SystemStatusWidget />
                                </section>
                                <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                                    <ActivityLogWidget logs={logs} />
                                </section>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
