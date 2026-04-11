import { useState, useEffect, useRef } from "react";
import {
    FaRocket,
    FaFileAlt,
    FaDatabase,
    FaCheckCircle,
    FaInfoCircle
} from "react-icons/fa";

function ActionButton({ onClick, children, disabled, primary, icon }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full p-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                ${primary
                    ? "bg-gradient-to-r from-blue-400 to-blue-500 hover:opacity-90"
                    : "bg-[#20201f] hover:bg-[#2a2a28]"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            {icon && <span className="text-lg">{icon}</span>}
            {children}
        </button>
    );
}

export default function SidebarRight({ logs, addLog }) {
    const [loading, setLoading] = useState(false);
    const logRef = useRef(null);

    const deploy = () => {
        if (loading) return;
        setLoading(true);
        addLog(`🚀 [${new Date().toLocaleTimeString()}] Deploy started...`);

        setTimeout(() => {
            setLoading(false);
            addLog(`✅ [${new Date().toLocaleTimeString()}] Model deployed successfully`);
        }, 2000);
    };

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogIcon = (log) => {
        if (log.includes("✅")) return <FaCheckCircle className="text-green-400" />;
        if (log.includes("🚀")) return <FaRocket className="text-blue-400" />;
        return <FaInfoCircle className="text-gray-400" />;
    };

    return (
        <aside className="fixed right-0 top-0 bottom-0 w-80 bg-[#0e0e0e] border-l border-[#20201f] p-6 flex flex-col">

            <div className="mb-6">

                {/* 🔹 TITLE */}
                <h2 className="text-blue-400 text-base font-semibold flex items-center gap-2 uppercase">
                    Quick Actions
                </h2>

                {/* 🔹 LABEL */}
                <p className="text-[0.65rem] text-gray-500 uppercase tracking-widest mt-1">
                    System Control
                </p>

                {/* 🔹 LINE */}
                <div className="h-px bg-[#20201f] mt-3"></div>

            </div>
            <div className="space-y-4 mb-6">
                <ActionButton
                    icon={<FaFileAlt />}
                    onClick={() => addLog("🧠 New script created")}
                >
                    New Script
                </ActionButton>

                <ActionButton
                    icon={<FaDatabase />}
                    onClick={() => addLog("🔗 Connected to database")}
                >
                    Connect Data
                </ActionButton>

                <ActionButton
                    icon={<FaRocket />}
                    onClick={deploy}
                    disabled={loading}
                    primary
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Deploying...
                        </span>
                    ) : (
                        "Deploy Model"
                    )}
                </ActionButton>
            </div>
            <h3 class="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Activity Logs</h3>
            {/* 📜 LOGS */}
            <div
                ref={logRef}
                className="flex-1 overflow-y-auto text-xs space-y-2 pr-2"
            >
                {logs.length === 0 ? (
                    <div className="text-gray-600">No logs yet...</div>
                ) : (
                    logs.map((log, i) => (
                        <div
                            key={i}
                            className="text-gray-400 bg-[#181818] px-3 py-2 rounded-md flex items-center gap-2"
                        >
                            {getLogIcon(log)}
                            <span>{log}</span>
                        </div>
                    ))
                )}
            </div>

            {/* 👤 USER PROFILE - FIXED */}
            <div className="mt-auto pt-4 border-t border-[#20201f] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                    JT
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">
                        Julian Thorne
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Lead Architect
                    </span>
                </div>

                <button className="ml-auto text-gray-400 hover:text-white">
                    ⎋
                </button>
            </div>

        </aside>
    );
}