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
            className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
            <div>
                <h1 className="mt-0 text-4xl font-black tracking-tight text-text lg:text-5xl">
                    Analytics
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                    Real-time insights into conversation volume, AI performance, and system health.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="rounded-2xl border border-border/70 bg-surface p-2 text-muted transition-colors hover:border-accent/40 hover:text-text"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" />

                    <NotificationDropdown
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface px-3 py-2">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                        alt="User"
                        className="h-8 w-8 rounded-xl border border-border/70 object-cover"
                    />
                    <div className="hidden md:block">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-text">
                            {user?.name || "Architect"}
                        </p>
                        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-accent">
                            Pro
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
