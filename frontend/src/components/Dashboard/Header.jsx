import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, LayoutGrid, SidebarClose, Sidebar, Info, CheckCircle, AlertTriangle } from "lucide-react";

export default function Header({ tab, setTab, toggleSidebar, rightOpen }) {
    const tabs = ["overview", "engine", "logs"];
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, text: "System sync complete", time: "2m ago", type: "success" },
        { id: 2, text: "New blueprint available", time: "15m ago", type: "info" },
        { id: 3, text: "Backup required", time: "1h ago", type: "warning" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-16 relative"
        >
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/5">
                {tabs.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`relative px-5 py-2 text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors ${tab === t ? "text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        {tab === t && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-lg -z-10"
                            />
                        )}
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex gap-4 items-center relative">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-[#0e0e0e]">
                            {notifications.length}
                        </span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                            >
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Notifications</h3>
                                    <span className="text-[10px] text-gray-500 hover:text-white cursor-pointer transition-colors">Mark all as read</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex gap-3 items-start">
                                                <div className={`mt-1 p-1.5 rounded-lg ${n.type === "success" ? "bg-green-500/10 text-green-400" :
                                                    n.type === "warning" ? "bg-yellow-500/10 text-yellow-400" :
                                                        "bg-blue-500/10 text-blue-400"
                                                    }`}>
                                                    {n.type === "success" ? <CheckCircle size={14} /> :
                                                        n.type === "warning" ? <AlertTriangle size={14} /> : <Info size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{n.text}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center bg-white/2 border-t border-white/5">
                                    <button className="text-[11px] text-gray-400 hover:text-white uppercase tracking-widest font-semibold transition-colors">
                                        View All Activity
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-colors">
                    <LayoutGrid size={20} />
                </button>
                <button
                    onClick={toggleSidebar}
                    className="p-2 ml-4 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 transition-all flex items-center gap-2 text-sm font-semibold"
                >
                    {rightOpen ? <SidebarClose size={18} /> : <Sidebar size={18} />}
                    <span className="hidden sm:inline">{rightOpen ? "Hide Tools" : "Show Tools"}</span>
                </button>
            </div>
        </motion.div>
    );
}
