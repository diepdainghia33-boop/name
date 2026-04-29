import React, { useState } from "react";
import { Search, Bell, Menu, MessageSquare, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import NotificationDropdown from "../Dashboard/NotificationDropdown";

export default function Header({
    searchQuery,
    setSearchQuery,
    user,
    onMenuToggle,
    onConversationsToggle,
    showMobileSearch,
}) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userName = user?.name || "Architect";
    const userInitials = userName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "A";

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-3 lg:grid lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:gap-6">
                <div className="flex min-w-0 items-center gap-2 lg:justify-self-start">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onMenuToggle}
                        className="rounded-2xl border border-border/70 bg-surface p-2 text-text md:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={18} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onConversationsToggle}
                        className="rounded-2xl border border-border/70 bg-surface p-2 text-text md:hidden"
                        aria-label="Toggle conversations"
                    >
                        <MessageSquare size={18} />
                    </motion.button>

                    <div className="hidden min-w-0 lg:flex">
                        <h1 className="flex min-w-0 items-end gap-2 font-black tracking-tight leading-none">
                            <span className="truncate text-[clamp(1.55rem,1.6vw,2.15rem)] text-text">
                                Architect
                            </span>
                            <span className="text-[clamp(1.8rem,1.85vw,2.35rem)] text-accent">
                                AI
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="hidden min-w-0 md:block lg:justify-self-center lg:w-full">
                    <div className="relative mx-auto w-full max-w-2xl">
                        <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="app-input pl-10 pr-4 text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 lg:justify-self-end">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={showMobileSearch}
                        className="rounded-2xl border border-border/70 bg-surface p-2 text-text md:hidden"
                        aria-label="Search"
                    >
                        <Search size={18} />
                    </motion.button>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative rounded-2xl border border-border/70 bg-surface p-3 text-muted transition-colors hover:border-accent/40 hover:text-text"
                            aria-label="Notifications"
                            aria-expanded={showNotifications}
                        >
                            <Bell size={16} />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                        </motion.button>

                        <NotificationDropdown
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    </div>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex min-w-[190px] items-center gap-3 rounded-2xl border border-border/70 bg-surface px-3 py-2.5"
                            aria-expanded={showUserMenu}
                            aria-label="User menu"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-background-elevated text-[13px] font-black uppercase text-text">
                                {userInitials}
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <p className="truncate text-[10px] font-black uppercase tracking-[0.24em] text-text">
                                    {userName.toUpperCase()}
                                </p>
                                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.26em] text-accent">
                                    Pro
                                </p>
                            </div>
                            <ChevronDown size={14} className="text-muted" />
                        </motion.button>

                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-[24px] border border-border/70 bg-background-elevated shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
                                <div className="border-b border-border/70 px-4 py-4">
                                    <p className="text-sm font-bold text-text">{user?.name}</p>
                                    <p className="mt-1 text-xs text-text-muted">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted transition-colors hover:bg-surface hover:text-text">
                                        Profile settings
                                    </button>
                                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted transition-colors hover:bg-surface hover:text-text">
                                        Preferences
                                    </button>
                                    <hr className="my-2 border-border/70" />
                                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger/10">
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
