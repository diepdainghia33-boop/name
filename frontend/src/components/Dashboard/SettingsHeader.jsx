import { motion } from "framer-motion";
import { useState } from "react";
import MaterialIcon from "./MaterialIcon";
import NotificationDropdown from "./NotificationDropdown";

export default function SettingsHeader({ toggleSidebar, rightOpen, user }) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center h-16 relative"
        >
            <div className="flex items-center gap-4">
                <span className="font-['Inter'] text-lg font-black uppercase tracking-widest text-white">System Configuration</span>
            </div>
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                    <div onClick={() => setShowNotifications(!showNotifications)}>
                        <MaterialIcon
                            name="notifications"
                            className="text-gray-400 hover:text-white transition-all cursor-pointer"
                        />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.7)]"></div>
                    </div>

                    {/* Notification Dropdown */}
                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right">
                        <p className="text-xs font-bold text-white leading-none">{user?.name || "Architect"}</p>
                        <p className="text-[10px] text-[#85adff] leading-none mt-1">Lead Architect</p>
                    </div>
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-lg bg-[#262626]"
                    />
                </div>
            </div>
        </motion.div>
    );
}
