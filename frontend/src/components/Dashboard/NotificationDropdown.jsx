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
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "success":
                return "text-success bg-success/10";
            case "warning":
                return "text-warning bg-warning/10";
            case "error":
                return "text-danger bg-danger/10";
            default:
                return "text-accent bg-accent/10";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60]"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={springTransition}
                        className="absolute right-0 top-16 z-[70] w-96 overflow-hidden rounded-[28px] border border-border/70 bg-background-elevated shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
                    >
                        <div className="flex items-center justify-between border-b border-border/70 bg-surface px-4 py-4">
                            <div>
                                <h3 className="text-sm font-black tracking-tight text-text">
                                    Notifications
                                </h3>
                                <p className="mt-1 text-xs text-text-muted">
                                    {notifications.filter((n) => !n.is_read).length} unread
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-xl border border-border/70 p-2 text-muted transition-colors hover:border-accent/40 hover:text-text"
                            >
                                <MaterialIcon name="close" />
                            </button>
                        </div>

                        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-2">
                            {loading ? (
                                <div className="p-8 text-center text-xs font-black uppercase tracking-[0.24em] text-muted">
                                    Syncing...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-xs font-black uppercase tracking-[0.24em] text-muted">
                                    No new alerts
                                </div>
                            ) : (
                                notifications.map((notif, index) => (
                                    <motion.button
                                        key={notif.id}
                                        type="button"
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                        onClick={() => markAsRead(notif.id)}
                                        className="mb-2 flex w-full items-start gap-3 rounded-[22px] border border-transparent px-3 py-3 text-left transition-colors hover:border-border/70 hover:bg-surface"
                                    >
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-transparent ${getTypeColor(notif.type)}`}>
                                            <MaterialIcon name={notif.icon} className="text-inherit" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`text-sm font-bold tracking-tight ${notif.is_read ? "text-text-muted" : "text-text"}`}>
                                                    {notif.title}
                                                </h4>
                                                <span className="shrink-0 text-[10px] text-text-dim">
                                                    {notif.time}
                                                </span>
                                            </div>
                                            <p className={`mt-1 line-clamp-2 text-xs leading-6 ${notif.is_read ? "text-text-dim" : "text-text-muted"}`}>
                                                {notif.message}
                                            </p>
                                        </div>

                                        {!notif.is_read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                                    </motion.button>
                                ))
                            )}
                        </div>

                        <div className="border-t border-border/70 bg-surface px-4 py-3">
                            <button className="flex w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-muted transition-colors hover:text-text">
                                View all notifications
                                <MaterialIcon name="arrow_forward" className="text-inherit" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
