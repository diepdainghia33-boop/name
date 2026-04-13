import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SidebarRight from "../components/Dashboard/SidebarRight";
import Header from "../components/Dashboard/Header";
import Metrics from "../components/Dashboard/Metrics";
import BlueprintCard from "../components/Dashboard/BlueprintCard";

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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { blueprints, logs, metrics } = response.data;
            setBlueprints(blueprints);
            setLogs(logs.map(l => ({
                id: l.id,
                message: l.message,
                type: l.type,
                time: new Date(l.created_at).toLocaleTimeString()
            })));
            setMetrics(metrics);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addLog = async (message, type = "info") => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://127.0.0.1:8000/api/dashboard/log", {
                message,
                type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
        tokens: metrics.tokens.toLocaleString(),
    }), [metrics]);

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
                            Welcome back, {user?.name || "Architect"}. Neural pathways are active and synchronized across all sectors.
                        </p>
                    </section>

                    {/* Error Feedback */}
                    {logs.length === 0 && !isLoading && !blueprints.length && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-[32px] mb-8">
                            <p className="text-yellow-500 text-sm font-bold flex items-center gap-3">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                                Neural Link Active but no sector data found. Try creating a draft.
                            </p>
                        </div>
                    )}

                    {/* CONTENT SWITCH */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">Synapsing Data...</p>
                        </div>
                    ) : (
                        <>
                            {tab === "overview" && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <Metrics data={formattedMetrics} />

                                    {/* BLUEPRINTS */}
                                    <section>
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-2xl font-bold tracking-tight">Recent Blueprints</h2>
                                            <button className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase hover:text-blue-300 transition-colors">
                                                VIEW ARCHIVE
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {blueprints.length === 0 ? (
                                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[32px] text-gray-600">
                                                    No neural drafts detected in this sector.
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

                            {tab === "engine" && (
                                <div className="p-12 text-center border border-white/5 rounded-[40px] bg-white/[0.02]">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
                                        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Engine Core Initializing</h3>
                                    <p className="text-gray-500 text-sm">Optimizing neural parameters for architectural rendering...</p>
                                </div>
                            )}

                            {tab === "logs" && (
                                <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {logs.length === 0
                                        ? <div className="py-12 text-center text-gray-600 italic">No temporal records found.</div>
                                        : logs.map(log => <LogItem key={log.id} log={log} />)
                                    }
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {showRightSidebar && (
                <SidebarRight
                    user={user}
                    logs={logs.map(l => `${l.time} - ${l.message}`)}
                    addLog={(msg) => addLog(msg)}
                />
            )}
        </div>
    );
}