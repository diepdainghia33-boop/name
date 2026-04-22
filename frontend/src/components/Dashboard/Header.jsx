import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header({ toggleSidebar, rightOpen }) {
    const [showNotifications, setShowNotifications] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-16 relative"
        >
            <div className="flex items-center gap-4">
                <span className="font-['Inter'] text-lg font-black uppercase tracking-widest text-white">System Configuration</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div onClick={() => setShowNotifications(!showNotifications)}>
                        <span className="material-symbols-outlined text-gray-400 hover:text-white transition-all cursor-pointer">notifications</span>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#fbabff] rounded-full shadow-[0_0_8px_rgba(251,171,255,0.7)]"></div>
                    </div>
                    
                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 transition-all flex items-center gap-2 text-sm font-semibold"
                >
                    <span className="hidden sm:inline">{rightOpen ? "Hide Tools" : "Show Tools"}</span>
                </button>
            </div>
        </motion.div>
    );
}