import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    Cpu, MessageSquare, History, Plus, Trash2, Search, MoreVertical,
    Pin, Archive, Edit3, Download, Copy, ChevronRight, Star, Lock, AlertCircle, X,
    FileCode, Settings, HelpCircle, Keyboard, Moon, Sun, ExternalLink, Sparkles,
    Image, Grid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RightPanel({
    conversations,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    onPinConversation,
    onArchiveConversation,
    onRenameConversation,
    activeId,
    isMobile = false,
    onClose,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [contextMenuId, setContextMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [pinnedIds, setPinnedIds] = useState(new Set());
    const [archivedIds, setArchivedIds] = useState(new Set());
    const [showArchived, setShowArchived] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const contextMenuRef = useRef(null);
    const moreMenuRef = useRef(null);
    const moreButtonRef = useRef(null);

    // Filter conversations
    const filteredConversations = useMemo(() => {
        let filtered = conversations.filter(c => {
            const isArchived = archivedIds.has(c.id);
            if (!showArchived && isArchived) return false;
            return true;
        });

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                (c.title || "").toLowerCase().includes(q) ||
                (c.preview || "").toLowerCase().includes(q)
            );
        }

        const pinned = filtered.filter(c => pinnedIds.has(c.id));
        const unpinned = filtered.filter(c => !pinnedIds.has(c.id));

        const sortByDate = (a, b) => {
            const dateA = new Date(a.updated_at || a.created_at || 0);
            const dateB = new Date(b.updated_at || b.created_at || 0);
            return dateB - dateA;
        };

        return {
            pinned: pinned.sort(sortByDate),
            unpinned: unpinned.sort(sortByDate)
        };
    }, [conversations, searchQuery, pinnedIds, archivedIds, showArchived]);

    // Group unpinned conversations by date
    const groupedUnpinned = useMemo(() => {
        const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
        const now = new Date();
        const today = now.setHours(0, 0, 0, 0);
        const yesterday = today - 86400000;
        const weekAgo = today - 7 * 86400000;

        filteredConversations.unpinned.forEach(conv => {
            const date = new Date(conv.updated_at || conv.created_at || 0).getTime();
            if (date >= today) {
                groups.today.push(conv);
            } else if (date >= yesterday) {
                groups.yesterday.push(conv);
            } else if (date >= weekAgo) {
                groups.thisWeek.push(conv);
            } else {
                groups.older.push(conv);
            }
        });

        return groups;
    }, [filteredConversations.unpinned]);

    // Handlers
    const handleContextMenu = (e, convId) => {
        e.preventDefault();
        setContextMenuId(convId);
        setMenuPosition({ top: e.clientY, left: e.clientX });
    };

    const closeContextMenu = () => {
        setContextMenuId(null);
    };

    useEffect(() => {
        const handleClickOutside = () => closeContextMenu();
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleMoreToggle = () => {
        setShowMoreMenu(!showMoreMenu);
    };

    const closeMoreMenu = () => {
        setShowMoreMenu(false);
    };

    useEffect(() => {
        const handleClickOutsideMore = (e) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
                closeMoreMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutsideMore);
        return () => document.removeEventListener('mousedown', handleClickOutsideMore);
    }, []);

    const handlePin = (id) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        onPinConversation?.(id, !pinnedIds.has(id));
        closeContextMenu();
    };

    const handleArchive = (id) => {
        setArchivedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        onArchiveConversation?.(id, !archivedIds.has(id));
        closeContextMenu();
    };

    const handleRename = (id, newTitle) => {
        if (newTitle && newTitle.trim()) {
            onRenameConversation?.(id, newTitle.trim());
        }
        closeContextMenu();
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setConversationToDelete(id);
        setShowDeleteConfirm(true);
        closeContextMenu();
    };

    const confirmDelete = () => {
        if (conversationToDelete) {
            onDeleteConversation?.(conversationToDelete);
            setConversationToDelete(null);
        }
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setConversationToDelete(null);
        setShowDeleteConfirm(false);
    };

    // Stats for each conversation
    const getConversationStats = (conv) => {
        const msgCount = conv.message_count || Math.floor(Math.random() * 20) + 1;
        const tokenCount = conv.token_count || Math.floor(Math.random() * 2000) + 100;
        return { msgCount, tokenCount };
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / 86400000);

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    // Render single conversation card
    const ConversationCard = ({ conv, showGroupLabel = false }) => {
        const isActive = activeId === conv.id;
        const isPinned = pinnedIds.has(conv.id);
        const stats = getConversationStats(conv);

        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: isMobile ? 20 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -20 : -16 }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => onSelectConversation?.(conv.id)}
                className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-200 border flex items-start gap-3 ${isActive
                    ? "bg-blue-600/10 border-blue-500/30 shadow-[inset_0_0_16px_rgba(59,130,246,0.08)]"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                onContextMenu={(e) => handleContextMenu(e, conv.id)}
            >
                {/* Pin indicator */}
                {isPinned && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Pin size={10} className="text-black fill-black" />
                    </div>
                )}

                {/* Icon */}
                <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isActive ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500 group-hover:text-blue-400"
                    }`}>
                    <MessageSquare size={14} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-[12px] font-bold truncate leading-snug flex-1 ${isActive ? "text-white" : "text-gray-300"
                            }`}>
                            {conv.title || "New conversation"}
                        </p>
                        {/* Context menu button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setContextMenuId(conv.id);
                                setMenuPosition({ top: e.clientY, left: e.clientX });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-colors hover:bg-white/10 text-gray-500 hover:text-white"
                            aria-label="Conversation options"
                        >
                            <MoreVertical size={14} />
                        </button>
                    </div>

                    {/* Preview snippet */}
                    {conv.preview && (
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {conv.preview}
                        </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mt-2 text-[9px] font-black uppercase tracking-wider text-gray-600">
                        <span className="flex items-center gap-1">
                            <History size={9} />
                            {formatDate(conv.updated_at || conv.created_at)}
                        </span>
                        <span>•</span>
                        <span>{stats.msgCount} msgs</span>
                        <span>•</span>
                        <span className="text-indigo-400/60">{stats.tokenCount} tkns</span>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Context Menu
    const ContextMenu = ({ conv }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            ref={contextMenuRef}
            className="fixed z-50 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            style={{ top: menuPosition.top, left: menuPosition.left }}
        >
            <div className="p-1.5">
                <button
                    onClick={() => handleRename(conv.id, prompt("Rename conversation:", conv.title || ""))}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                    <Edit3 size={13} />
                    Rename
                </button>
                <button
                    onClick={() => handlePin(conv.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                    <Pin size={13} />
                    {pinnedIds.has(conv.id) ? "Unpin" : "Pin"}
                </button>
                <button
                    onClick={() => handleArchive(conv.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                    <Archive size={13} />
                    {archivedIds.has(conv.id) ? "Unarchive" : "Archive"}
                </button>
                <button
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                    <Copy size={13} />
                    Duplicate
                </button>
                <button
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-colors"
                >
                    <Download size={13} />
                    Export
                </button>
            </div>
            <div className="border-t border-white/10 p-1.5">
                <button
                    onClick={(e) => handleDeleteClick(e, conv.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 size={13} />
                    Delete
                </button>
            </div>
        </motion.div>
    );

    // Empty state
    const EmptyState = ({ message }) => (
        <div className="flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <History size={20} className="text-gray-500" />
            </div>
            <p className="text-xs font-medium text-gray-400">{message}</p>
        </div>
    );

    // Compact Project Codex Button
    const ProjectCodexButton = () => (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-blue-200 font-semibold text-xs transition-all duration-200 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles size={14} className="relative z-10" />
            <span className="relative z-10">Codex</span>
        </motion.button>
    );

    const MoreMenu = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            className="absolute right-0 top-full mt-2 w-56 
                   bg-[#1f1f1f]/95 backdrop-blur-md
                   rounded-2xl shadow-2xl border border-white/10 
                   overflow-hidden z-50"
        >
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition">
                <Image size={18} />
                Images
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition">
                <Cpu size={18} />
                Deep research
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition">
                <Grid size={18} />
                Apps
            </button>
        </motion.div>
    );

    // Stats footer
    const StatsFooter = () => {
        const totalMsgs = conversations.reduce((sum, c) => sum + (c.message_count || 0), 0);
        const totalTokens = conversations.reduce((sum, c) => sum + (c.token_count || 0), 0);
        const activeToday = filteredConversations.pinned.length + groupedUnpinned.today.length;

        return (
            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Session Stats</p>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Total Chats</span>
                        <span className="text-[11px] font-black text-white">{conversations.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Today</span>
                        <span className="text-[11px] font-black text-blue-400">{activeToday}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Pinned</span>
                        <span className="text-[11px] font-black text-yellow-400">{pinnedIds.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Messages</span>
                        <span className="text-[11px] font-black text-white">{totalMsgs}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">Tokens</span>
                        <span className="text-[11px] font-black text-indigo-400">{totalTokens.toLocaleString()}</span>
                    </div>

                    {archivedIds.size > 0 && (
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5 hover:border-white/10"
                        >
                            {showArchived ? <Lock size={12} /> : <AlertCircle size={12} />}
                            {showArchived ? "Hide" : "Show"} Archived ({archivedIds.size})
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Delete Confirm Modal
    const DeleteConfirmModal = () => (
        <AnimatePresence>
            {showDeleteConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={cancelDelete}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 size={20} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Delete Conversation?</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">
                            This action cannot be undone. The conversation and all its data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-lg shadow-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Date section header
    const DateHeader = ({ label }) => (
        <div className="flex items-center gap-2 mb-3 pt-2 first:pt-0">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{label}</span>
            <div className="h-px flex-1 bg-white/10" />
        </div>
    );

    // Mobile header
    const MobileHeader = () => (
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0b0b0b]">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-1 ring-white/10">
                    <FileCode size={14} className="text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">ChatID</h2>
                    <p className="text-[9px] text-gray-500">Codex v2.4</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMoreToggle}
                    className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="More options"
                >
                    <MoreVertical size={16} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close"
                >
                    <X size={16} />
                </motion.button>
            </div>
            <AnimatePresence>
                {showMoreMenu && <MoreMenu />}
            </AnimatePresence>
        </div>
    );

    // Desktop Header
    const DesktopHeader = () => (
        <div className="hidden lg:block mb-5 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/10">
                    <FileCode size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-black uppercase tracking-wider text-white truncate">
                        ChatID Codex
                    </h2>
                    <p className="text-[9px] text-gray-500">v2.4.0 • Active</p>
                </div>
                <ProjectCodexButton />
            </div>
        </div>
    );

    const containerClasses = isMobile
        ? "fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-[#0e0e0e] flex flex-col z-50"
        : "w-72 h-screen bg-[#0e0e0e] border-l border-white/5 p-5 text-white hidden lg:flex flex-col relative z-20";

    return (
        <aside className={containerClasses}>
            {isMobile && <MobileHeader />}

            {/* Desktop Header */}
            {!isMobile && <DesktopHeader />}

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-4 ${isMobile ? 'px-0' : ''}`}>

                {/* Search Bar */}
                <div className="relative group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className={`w-full bg-white/[0.03] border border-white/10 hover:border-blue-500/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10 pr-10 py-2.5 rounded-2xl text-[12px] font-medium text-gray-200 placeholder-gray-600 outline-none ${isMobile ? 'text-sm' : ''}`}
                    />
                    {searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                        >
                            <X size={12} />
                        </motion.button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onNewConversation}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/20"
                        aria-label="Start new conversation"
                    >
                        <Plus size={14} />
                        <span>New Chat</span>
                    </motion.button>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleMoreToggle}
                            className="px-3 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all"
                            aria-label="More options"
                        >
                            <MoreVertical size={18} />
                        </motion.button>
                        <AnimatePresence>
                            {showMoreMenu && <MoreMenu />}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Conversations Header */}
                {(filteredConversations.pinned.length > 0 || Object.values(groupedUnpinned).some(arr => arr.length > 0)) && (
                    <div className="flex items-center justify-between pt-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                            Conversations
                        </h3>
                        <span className="text-[9px] text-gray-600 font-medium">{conversations.length} total</span>
                    </div>
                )}

                {/* Pinned Conversations */}
                {filteredConversations.pinned.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Pin size={12} className="text-yellow-400 fill-yellow-400" />
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400/70">
                                Pinned
                            </p>
                        </div>
                        <AnimatePresence>
                            {filteredConversations.pinned.map((conv) => (
                                <ConversationCard key={conv.id} conv={conv} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Date-grouped sections */}
                {Object.entries(groupedUnpinned).map(([group, convs]) => (
                    convs.length > 0 && (
                        <div key={group} className="space-y-2">
                            <DateHeader
                                label={
                                    group === "today" ? "Today" :
                                        group === "yesterday" ? "Yesterday" :
                                            group === "thisWeek" ? "This Week" : "Older"
                                }
                            />
                            <AnimatePresence>
                                {convs.map((conv) => (
                                    <ConversationCard key={conv.id} conv={conv} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )
                ))}

                {/* Empty state */}
                {filteredConversations.pinned.length === 0 &&
                    Object.values(groupedUnpinned).every(arr => arr.length === 0) && (
                        <EmptyState message={searchQuery ? "No conversations match your search" : "No conversations yet. Start chatting!"} />
                    )}

                {/* Spacer */}
                <div className="h-4" />
            </div>

            {/* Stats Footer */}
            {!isMobile && <StatsFooter />}

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenuId && (
                    <ContextMenu conv={conversations.find(c => c.id === contextMenuId)} />
                )}
            </AnimatePresence>

            {/* More Menu (Mobile) */}
            {isMobile && showMoreMenu && (
                <div className="fixed inset-0 z-40" onClick={closeMoreMenu}>
                    <div className="absolute top-16 left-4 right-4">
                        <MoreMenu />
                    </div>
                </div>
            )}
        </aside>
    );
}
