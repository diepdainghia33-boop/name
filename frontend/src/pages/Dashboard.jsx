import { useState, useEffect, useMemo, useRef } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SidebarRight from "../components/Dashboard/SidebarRight";
import Header from "../components/Dashboard/Header";
import Metrics from "../components/Dashboard/Metrics";
import BlueprintCard from "../components/Dashboard/BlueprintCard";

export default function Dashboard() {
    const [tab, setTab] = useState("overview");
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    const [metrics, setMetrics] = useState({
        health: 99.9,
        tokens: 1200000,
        latency: 42,
    });

    const [logs, setLogs] = useState([
        createLog("Prism Logic v4 synchronized", "success"),
        createLog("Neural Arch V2 training initialized", "info"),
        createLog("Backup complete: Global Hub", "success"),
    ]);

    // Blueprint data
    const blueprints = [
        { title: "Neural Arch V2", type: "info" },
        { title: "Skyline Simulation", type: "info" },
        { title: "Quantum Core", type: "success" },
    ];

    function createLog(message, type = "info") {
        return {
            id: Date.now() + Math.random(),
            message,
            type,
            time: new Date().toLocaleTimeString(),
        };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics((prev) => ({
                ...prev,
                latency: Math.floor(Math.random() * 20) + 30,
                health: +(99 + Math.random()).toFixed(2),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (message, type = "info") => {
        setLogs((prev) => [createLog(message, type), ...prev].slice(0, 50));
    };

    const formattedMetrics = useMemo(() => ({
        ...metrics,
        tokens: metrics.tokens.toLocaleString(),
    }), [metrics]);

    const logRef = useRef(null);
    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = 0;
    }, [logs]);

    const LogItem = ({ log }) => (
        <div className="bg-[#1a1a1a] p-3 rounded flex justify-between items-center">
            <span className={`${log.type === "success" ? "text-green-400" :
                log.type === "warning" ? "text-yellow-400" : "text-gray-300"
                }`}>
                {log.message}
            </span>
            <span className="text-xs text-gray-500">{log.time}</span>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#0e0e0e] text-white">
            <SidebarLeft />

            <main className={`ml-64 ${showRightSidebar ? "mr-80" : "mr-0"} flex-1 px-6 py-10 overflow-y-auto`}>
                <div className="max-w-6xl mx-auto space-y-12">

                    <Header
                        tab={tab}
                        setTab={setTab}
                        toggleSidebar={() => setShowRightSidebar(prev => !prev)}
                    />

                    {/* HERO */}
                    <section className="mb-12">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-3">
                            Constructing <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                Intelligence
                            </span>
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Welcome back, Architect. System is live and synchronized.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-sm text-gray-400">
                                System Operational ({metrics.health}%)
                            </span>
                        </div>
                    </section>

                    {/* CONTENT SWITCH */}
                    {tab === "overview" && (
                        <>
                            <Metrics data={formattedMetrics} />

                            {/* BLUEPRINTS */}
                            <section>
                                <div className="flex justify-between mb-6">
                                    <h2 className="text-xl font-bold">Recent Blueprints</h2>
                                    <span className="text-blue-400 text-xs cursor-pointer hover:underline">
                                        VIEW ARCHIVE
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blueprints.map(bp => (
                                        <BlueprintCard
                                            key={bp.title}
                                            title={bp.title}
                                            onClick={() => addLog(`Opened ${bp.title}`, bp.type)}
                                        />
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {tab === "engine" && (
                        <div className="text-gray-400 animate-pulse">
                            ⚙️ Engine Control Panel loading...
                        </div>
                    )}

                    {tab === "logs" && (
                        <div ref={logRef} className="space-y-3">
                            {logs.length === 0
                                ? <div className="text-gray-500">No logs available</div>
                                : logs.map(log => <LogItem key={log.id} log={log} />)
                            }
                        </div>
                    )}
                </div>
            </main>

            {showRightSidebar && (
                <SidebarRight
                    logs={logs.map(l => `${l.time} - ${l.message}`)}
                    addLog={(msg) => addLog(msg)}
                />
            )}
        </div>
    );
}