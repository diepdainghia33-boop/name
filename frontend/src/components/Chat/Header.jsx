import React, { useState } from "react";
import { Search, Bell, Menu, X, ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ searchQuery, setSearchQuery, user, onMenuToggle, onConversationsToggle, showMobileSearch }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="w-full px-4 md:px-8 py-4 border-b border-white/5 bg-[#0b0b0b]/80 backdrop-blur-xl flex items-center justify-between z-40">
            {/* LEFT - Status & Mobile Menu */}
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-white"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </motion.button>

                {/* Mobile conversations toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onConversationsToggle}
                    className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    aria-label="Toggle conversations"
                >
                    <MessageSquare size={20} />
                </motion.button>

                <div className="flex flex-col">
                    <h1 className="text-[11px] sm:text-[13px] font-black uppercase tracking-[0.3em] text-white/90 hidden sm:block">
                        Neural Dynamics <span className="text-blue-500">v4</span>
                    </h1>
                </div>
            </div>

            {/* RIGHT - Actions */}
            <div className="flex items-center gap-2 sm:gap-6">
                {/* Mobile search toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={showMobileSearch}
                    className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    aria-label="Search"
                >
                    <Search size={18} />
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 sm:p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                    >
                        <Bell size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] border border-black"></span>
                    </motion.button>

                    {/* Notifications dropdown */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-3 border-b border-white/5">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Notifications</h3>
                                </div>
                                <div className="p-4 text-center text-gray-400 text-sm">
                                    No new notifications
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-white/10"
                        aria-expanded={showUserMenu}
                        aria-label="User menu"
                    >
                        <div className="text-right hidden xl:block">
                            <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-white leading-none mb-1">
                                {user?.name || "Architect"}
                            </p>
                            <p className="text-[8px] sm:text-[9px] font-black text-blue-500/60 uppercase tracking-tighter hidden sm:block">
                                Verified Identity
                            </p>
                        </div>
                        <div className="relative">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-xl border border-white/10 group-hover:rotate-6 transition-transform">
                                <span className="text-[11px] sm:text-[12px] font-black text-white">
                                    {user?.name?.charAt(0) || "A"}
                                </span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0b0b0b] rounded-full"></div>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                    </motion.button>

                    {/* User dropdown */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-3 border-b border-white/5">
                                    <p className="text-sm font-bold text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                        Profile Settings
                                    </button>
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                        Preferences
                                    </button>
                                    <hr className="my-2 border-white/10" />
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
