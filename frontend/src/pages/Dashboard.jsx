import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Dashboard/Header";
import Metrics from "../components/Dashboard/Metrics";
import BlueprintCard from "../components/Dashboard/BlueprintCard";

const SidebarRight = lazy(() => import("../components/Dashboard/SidebarRight"));

export default function Dashboard() {
    const [tab, setTab] = useState("overview");
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [metrics, setMetrics] = useState({
        health: 0,
        tokens: 0,
        latency: 0,
        projects: 0
    });

    const [logs, setLogs] = useState([]);
    const [blueprints, setBlueprints] = useState([]);

    // 🚀 LOAD NHANH + CACHE
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        // ⚡ load cache trước
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

    // 🚀 FETCH TỐI ƯU
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");

            // ⚡ CALL SONG SONG
            const [dashboardRes, aiRes] = await Promise.allSettled([
                axios.get("http://127.0.0.1:8000/api/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 4000
                }),
                axios.get("http://127.0.0.1:8001/api/stats", {
                    timeout: 1500
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

            const aiStats =
                aiRes.status === "fulfilled" ? aiRes.value.data : {};

            const mergedMetrics = {
                ...metrics,
                total_messages: aiStats.total_messages || 0,
                tokens: aiStats.total_tokens || 0,
                health: aiStats.health || 0
            };

            // ⚡ SET STATE ÍT NHẤT CÓ THỂ
            setBlueprints(blueprints);
            setLogs(mappedLogs);
            setMetrics(mergedMetrics);
            setIsLoading(false);

            // 💾 CACHE
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

    // ⚡ MEMO TRÁNH RENDER LẠI
    const formattedMetrics = useMemo(() => ({
        ...metrics,
        tokens: metrics.tokens.toLocaleString(),
    }), [metrics]);

    const memoLogs = useMemo(
        () => logs.map(l => `${l.time} - ${l.message}`),
        [logs]
    );

    const LogItem = ({ log }) => (
        <div className="bg-[#1a1a1a]/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center backdrop-blur-sm hover:bg-white/5 transition-all">
            <span className={`${log.type === "success" ? "text-green-400" :
                log.type === "warning" ? "text-yellow-400" : "text-gray-300"
                } text-sm font-medium`}>
                {log.message}
            </span>
            <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">
                {log.time}
            </span>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden">
            <SidebarLeft user={user} />

            <main className={`ml-64 ${showRightSidebar ? "mr-80" : "mr-0"} flex-1 px-8 py-10 overflow-y-auto transition-all duration-300 scrollbar-hide`}>
                <div className="max-w-6xl mx-auto space-y-12">

                    <Header
                        tab={tab}
                        setTab={setTab}
                        toggleSidebar={() => setShowRightSidebar(prev => !prev)}
                        rightOpen={showRightSidebar}
                    />

                    {/* HERO */}
                    <section className="mb-12">
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-4">
                            Constructing <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Intelligence
                            </span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            Welcome back, {user?.name || "Architect"}.
                        </p>
                    </section>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {tab === "overview" && (
                                <div className="space-y-12">
                                    <Metrics data={formattedMetrics} />

                                    <section>
                                        <h2 className="text-2xl font-bold mb-8">Recent Blueprints</h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {blueprints.length === 0 ? (
                                                <div className="col-span-full py-12 text-center text-gray-600">
                                                    No data
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
                            )}

                            {tab === "logs" && (
                                <div className="space-y-4 max-w-3xl">
                                    {logs.map(log => <LogItem key={log.id} log={log} />)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {showRightSidebar && (
                <Suspense fallback={null}>
                    <SidebarRight
                        user={user}
                        logs={memoLogs}
                        addLog={addLog}
                    />
                </Suspense>
            )}
        </div>
    );
}