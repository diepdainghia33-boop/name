import { motion, AnimatePresence } from "framer-motion";
import MaterialIcon from "./MaterialIcon";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

const sampleNotifications = [
    {
        id: 1,
        title: "Profile Updated",
        message: "Your account information has been successfully updated.",
        time: "2 min ago",
        type: "success",
        icon: "person_check"
    },
    {
        id: 2,
        title: "Security Alert",
        message: "New login detected from Chrome on Windows.",
        time: "15 min ago",
        type: "warning",
        icon: "security"
    },
    {
        id: 3,
        title: "System Maintenance",
        message: "Scheduled maintenance tonight at 2:00 AM UTC.",
        time: "1 hour ago",
        type: "info",
        icon: "build"
    },
    {
        id: 4,
        title: "Password Changed",
        message: "Your password was successfully changed.",
        time: "2 hours ago",
        type: "success",
        icon: "lock"
    }
];

export default function NotificationDropdown({ isOpen, onClose }) {
    const getTypeColor = (type) => {
        switch (type) {
            case "success": return "text-green-400 bg-green-500/10";
            case "warning": return "text-yellow-400 bg-yellow-500/10";
            case "error": return "text-red-400 bg-red-500/10";
            default: return "text-[#85adff] bg-[#85adff]/10";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60]"
                    />

                    {/* Dropdown Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={springTransition}
                        className="absolute right-0 top-16 w-96 max-h-[80vh] bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div>
                                <h3 className="font-bold text-white">Notifications</h3>
                                <p className="text-xs text-[#adaaaa]">{sampleNotifications.length} unread</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <MaterialIcon name="close" className="text-gray-400" />
                            </button>
                        </div>

                        {/* Notification List */}
                        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar p-2">
                            {sampleNotifications.map((notif, index) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group mb-2 border border-transparent hover:border-white/5"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getTypeColor(notif.type)}`}>
                                            <MaterialIcon name={notif.icon} className="text-sm" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-bold text-sm text-white group-hover:text-[#85adff] transition-colors">
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] text-[#adaaaa] shrink-0">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-[#adaaaa] mt-1 leading-relaxed line-clamp-2">
                                                {notif.message}
                                            </p>
                                        </div>

                                        {/* Unread Indicator */}
                                        <div className="w-2 h-2 rounded-full bg-[#fbabff] mt-2 shrink-0" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-white/5 bg-black/20">
                            <button className="w-full py-2 text-xs font-['Space_Grotesk'] uppercase tracking-wider text-[#adaaaa] hover:text-white transition-colors flex items-center justify-center gap-2">
                                View All Notifications
                                <MaterialIcon name="arrow_forward" className="text-xs" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
