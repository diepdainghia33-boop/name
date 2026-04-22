import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import MaterialIcon from "./MaterialIcon";
import { api } from "../../api/axios";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

export default function NotificationDropdown({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get("/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };
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
                                <p className="text-xs text-[#adaaaa]">{notifications.filter(n => !n.is_read).length} unread</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <MaterialIcon name="close" className="text-gray-400" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] custom-scrollbar p-2">
                            {loading ? (
                                <div className="p-8 text-center text-xs text-slate-500 uppercase tracking-widest font-black">Syncing...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-500 uppercase tracking-widest font-black">No new alerts</div>
                            ) : (
                                notifications.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => markAsRead(notif.id)}
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
                                                    <h4 className={`font-bold text-sm ${notif.is_read ? 'text-slate-500' : 'text-white group-hover:text-[#85adff]'} transition-colors`}>
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] text-[#adaaaa] shrink-0">{notif.time}</span>
                                                </div>
                                                <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${notif.is_read ? 'text-slate-600' : 'text-[#adaaaa]'}`}>
                                                    {notif.message}
                                                </p>
                                            </div>

                                            {/* Unread Indicator */}
                                            {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[#fbabff] mt-2 shrink-0 shadow-[0_0_8px_rgba(251,171,255,0.8)]" />}
                                        </div>
                                    </motion.div>
                                ))
                            )}
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
