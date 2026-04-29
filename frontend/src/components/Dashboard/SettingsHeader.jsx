import { motion } from "framer-motion";
import { useState } from "react";
import MaterialIcon from "./MaterialIcon";
import NotificationDropdown from "./NotificationDropdown";

export default function SettingsHeader({ user }) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 py-4"
        >
            <div>
                <h1 className="mt-0 text-2xl font-black tracking-tight text-text sm:text-3xl">
                    Settings
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="flex h-11 items-center justify-center rounded-2xl border border-border/70 bg-surface px-3 text-muted transition-colors hover:border-accent/40 hover:text-text"
                        aria-label="Notifications"
                    >
                        <MaterialIcon name="notifications" className="text-inherit" />
                    </button>
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface px-3 py-2">
                    <div className="text-right">
                        <p className="text-xs font-bold text-text leading-none">
                            {user?.name || "Architect"}
                        </p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                            Lead architect
                        </p>
                    </div>
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                        alt="User Avatar"
                        className="h-9 w-9 rounded-xl border border-border/70 bg-background-elevated object-cover"
                    />
                </div>
            </div>
        </motion.div>
    );
}
