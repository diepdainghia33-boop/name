import { motion } from "framer-motion";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header({ toggleSidebar, rightOpen }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-border/70 bg-background-elevated/80 px-5 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:px-6"
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                    <h1 className="text-[clamp(2rem,3vw,3.75rem)] font-black tracking-tight text-text leading-[0.95]">
                    Dashboard
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                        Real-time insights into conversation volume, AI performance, and system health.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-surface text-text-dim transition-all hover:border-accent/40 hover:text-text hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                            aria-label="Notifications"
                        >
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
                        <NotificationDropdown
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-[22px] border border-border/70 bg-surface px-3 py-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background-elevated text-sm font-black uppercase text-text">
                            {(user?.name || "Architect").slice(0, 2)}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-text">
                                {user?.name || "Architect"}
                            </p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-accent">
                                Pro
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
