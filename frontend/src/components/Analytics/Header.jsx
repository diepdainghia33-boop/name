import { motion } from "framer-motion";
import { useState } from "react";
import NotificationDropdown from "../Dashboard/NotificationDropdown";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10"
        >
            {/* LEFT */}
            <div>
                <h1 className="font-['Inter'] text-4xl lg:text-5xl font-extrabold tracking-tighter mb-2">
                    Analytics <span className="text-[#85adff]">Dashboard</span>
                </h1>
                <p className="text-[#adaaaa] max-w-xl font-['Inter'] leading-relaxed">
                    Real-time insights into conversation volume, AI performance, and system health.
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* NOTIFICATION */}
                <div className="relative">
                    <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="cursor-pointer p-2 bg-white/5 rounded-xl border border-white/5 hover:border-[#85adff]/30 transition-all"
                    >
                        <span className="material-symbols-outlined text-gray-300 hover:text-white">
                            notifications
                        </span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#fbabff] rounded-full animate-pulse"></span>
                    </div>

                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                {/* USER AVATAR */}
                <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-2 py-1 hover:border-[#85adff]/30 transition-all cursor-pointer">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                        alt="User"
                        className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="hidden md:block">
                        <p className="text-xs font-bold text-white leading-none uppercase tracking-widest">
                            {user?.name || "Architect"}
                        </p>
                        <p className="text-[9px] text-[#85adff] font-medium">PRO</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}