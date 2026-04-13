import { Plus, Home, MessageSquare, BarChart3, Settings, Search, Sparkles, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const iconMap = {
    home: <Home size={20} />,
    chat: <MessageSquare size={20} />,
    monitoring: <BarChart3 size={20} />,
    settings: <Settings size={20} />,
};

function NavItem({ icon, text, active, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${active
                ? "bg-white/[0.08] text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                : "text-gray-400 hover:text-white"
                }`}
        >
            {/* Active Glow Indicator */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[4px_0_15px_rgba(59,130,246,0.6)]"
                    />
                )}
            </AnimatePresence>

            <div className={`flex items-center justify-center transition-all duration-500 ${active ? "text-blue-400 scale-110" : "group-hover:text-white group-hover:scale-110"}`}>
                {iconMap[icon]}
            </div>
            
            <span className={`text-[15px] font-semibold tracking-wide transition-all duration-300 ${active ? "text-white" : "group-hover:translate-x-1"}`}>
                {text}
            </span>

            {active && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
                />
            )}
        </motion.div>
    );
}

export default function Sidebar({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Overview", icon: "home", path: "/dashboard" },
        { text: "AI Chat", icon: "chat", path: "/chat" },
        { text: "Analytics", icon: "monitoring", path: "/analytics" },
        { text: "Configurations", icon: "settings", path: "/settings" },
    ];

    return (
        <aside className="fixed left-0 top-0 w-72 h-screen bg-black/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-[100]">
            {/* Top Branding */}
            <div className="p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-4 cursor-pointer group"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight leading-none text-white">
                            ARCHITECT<span className="text-blue-500">.</span>
                        </h1>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1.5">Core System v2</p>
                    </div>
                </motion.div>
            </div>

            {/* Global Search Bar */}
            <div className="px-6 mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-blue-400 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search commands..." 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold text-gray-300 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-4 space-y-1">
                <p className="px-5 text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-4">Master Control</p>
                {menuItems.map((item, i) => (
                    <NavItem 
                        key={item.text}
                        icon={item.icon} 
                        text={item.text} 
                        active={location.pathname === item.path} 
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </div>

            {/* Bottom Section - Identity */}
            <div className="p-6 mt-auto">
                {/* Upgrade Card */}
                <div className="relative p-5 rounded-3xl bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 mb-6 overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full" />
                    <h4 className="text-xs font-bold text-blue-400 mb-1">Architect Pro</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-4 italic">Unlock unlimited model context & high-fidelity renders.</p>
                    <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                        Upgrade Now
                    </button>
                </div>

                <div className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 p-0.5 bg-white/5 group transform hover:rotate-6 transition-transform">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff`} 
                            alt="User" 
                            className="w-full h-full rounded-[10px] object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate leading-none mb-1">{user?.name || "Architect"}</p>
                        <p className="text-[10px] text-gray-500 font-semibold truncate tracking-tight uppercase">System Operator</p>
                    </div>
                    <LogOut 
                        size={16} 
                        className="text-gray-600 hover:text-red-500 cursor-pointer transition-colors" 
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}
                    />
                </div>
            </div>
        </aside>
    );
}
