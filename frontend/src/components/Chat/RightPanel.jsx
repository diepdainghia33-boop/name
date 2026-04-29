import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    Archive,
    Copy,
    Cpu,
    Download,
    Edit3,
    FileCode,
    Grid,
    History,
    Image,
    Lock,
    MessageSquare,
    MoreVertical,
    Pin,
    Plus,
    Search,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function sortByDate(a, b) {
    const dateA = new Date(a.updated_at || a.created_at || 0);
    const dateB = new Date(b.updated_at || b.created_at || 0);
    return dateB - dateA;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SectionLabel({ label }) {
    return (
        <div className="flex items-center gap-2 mb-3 pt-2 first:pt-0">
            <div className="h-px flex-1 bg-border/70" />
            <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">{label}</span>
            <div className="h-px flex-1 bg-border/70" />
        </div>
    );
}

function ProjectCodexButton() {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-surface px-3 py-2.5 text-xs font-semibold text-accent transition-all duration-200 hover:border-border-strong hover:text-accent-strong"
        >
            <Sparkles size={14} className="relative z-10" />
            <span className="relative z-10">Codex</span>
        </motion.button>
    );
}

function MoreMenu() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border/70 bg-background-elevated/95 shadow-2xl backdrop-blur-md"
        >
            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-muted transition hover:bg-surface-strong hover:text-text">
                <Image size={18} />
                Images
            </button>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-muted transition hover:bg-surface-strong hover:text-text">
                <Cpu size={18} />
                Deep research
            </button>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text-muted transition hover:bg-surface-strong hover:text-text">
                <Grid size={18} />
                Apps
            </button>
        </motion.div>
    );
}

export default function RightPanel({
    conversations = [],
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
    const [showArchived, setShowArchived] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const panelRef = useRef(null);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setContextMenu(null);
                setShowMoreMenu(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    const filteredConversations = useMemo(() => {
        let filtered = conversations.filter((conversation) => {
            return showArchived || !conversation.is_archived;
        });

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((conversation) =>
                (conversation.title || "").toLowerCase().includes(q) ||
                (conversation.preview || "").toLowerCase().includes(q)
            );
        }

        const pinned = filtered.filter((conversation) => conversation.is_pinned).sort(sortByDate);
        const unpinned = filtered.filter((conversation) => !conversation.is_pinned).sort(sortByDate);
        return { pinned, unpinned };
    }, [conversations, searchQuery, showArchived]);

    const groupedUnpinned = useMemo(() => {
        const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
        const now = new Date();
        const today = now.setHours(0, 0, 0, 0);
        const yesterday = today - 86400000;
        const weekAgo = today - 7 * 86400000;

        filteredConversations.unpinned.forEach((conversation) => {
            const date = new Date(conversation.updated_at || conversation.created_at || 0).getTime();
            if (date >= today) groups.today.push(conversation);
            else if (date >= yesterday) groups.yesterday.push(conversation);
            else if (date >= weekAgo) groups.thisWeek.push(conversation);
            else groups.older.push(conversation);
        });

        return groups;
    }, [filteredConversations.unpinned]);

    const openContextMenu = (event, conv) => {
        event.stopPropagation();
        setShowMoreMenu(false);
        setContextMenu({
            id: conv.id,
            title: conv.title || "New conversation",
            top: event.clientY,
            left: event.clientX,
        });
    };

    const closeContextMenu = () => setContextMenu(null);

    const togglePin = (id) => {
        const conversation = conversations.find((item) => item.id === id);
        onPinConversation?.(id, !conversation?.is_pinned);
    };

    const toggleArchive = (id) => {
        const conversation = conversations.find((item) => item.id === id);
        onArchiveConversation?.(id, !conversation?.is_archived);
    };

    const handleRename = (conv) => {
        const nextTitle = prompt("Rename conversation:", conv.title || "");
        if (nextTitle && nextTitle.trim()) {
            onRenameConversation?.(conv.id, nextTitle.trim());
        }
        closeContextMenu();
    };

    const handleDeleteClick = (id) => {
        setConversationToDelete(id);
        setShowDeleteConfirm(true);
        closeContextMenu();
    };

    const confirmDelete = () => {
        if (conversationToDelete) {
            onDeleteConversation?.(conversationToDelete);
        }
        setConversationToDelete(null);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = () => {
        setConversationToDelete(null);
        setShowDeleteConfirm(false);
    };

    const totalMsgs = conversations.reduce((sum, conversation) => sum + Number(conversation.message_count || 0), 0);
    const totalTokens = conversations.reduce((sum, conversation) => sum + Number(conversation.token_count || 0), 0);
    const activeToday = filteredConversations.pinned.length + groupedUnpinned.today.length;
    const archivedCount = conversations.filter((conversation) => conversation.is_archived).length;
    const contextConversation = contextMenu
        ? conversations.find((conversation) => conversation.id === contextMenu.id)
        : null;

    const containerClasses = isMobile
        ? "fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-background text-text"
        : "relative z-20 hidden h-screen w-72 flex-col border-l border-border/70 bg-background p-5 text-text lg:flex";

    const ConversationCard = ({ conv }) => {
        const isActive = activeId === conv.id;
        const isPinned = Boolean(conv.is_pinned);
        const msgCount = Number(conv.message_count || 0);
        const tokenCount = Number(conv.token_count || 0);

        return (
            <motion.button
                type="button"
                layout
                initial={{ opacity: 0, x: isMobile ? 20 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isMobile ? -20 : -16 }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => onSelectConversation?.(conv.id)}
                onContextMenu={(event) => openContextMenu(event, conv)}
                className={`group relative flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${isActive
                    ? "border-accent/20 bg-accent/10 shadow-[inset_0_0_16px_rgba(0,0,0,0.12)]"
                    : "border-border/70 bg-surface hover:border-border-strong hover:bg-background-elevated"
                    }`}
            >
                {isPinned && (
                    <div className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning shadow-lg">
                        <Pin size={10} className="text-background fill-background" />
                    </div>
                )}

                <div className={`mt-0.5 flex-shrink-0 rounded-lg p-1.5 ${isActive ? "bg-accent/15 text-accent" : "bg-surface text-text-dim group-hover:text-accent"}`}>
                    <MessageSquare size={14} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`min-w-0 flex-1 truncate text-[12px] font-bold leading-snug ${isActive ? "text-text" : "text-text-muted"}`}>
                            {conv.title || "New conversation"}
                        </p>
                        <button
                            type="button"
                            onClick={(event) => openContextMenu(event, conv)}
                            className="rounded p-1 text-text-dim opacity-0 transition hover:bg-surface-strong hover:text-text group-hover:opacity-100"
                            aria-label="Conversation options"
                        >
                            <MoreVertical size={14} />
                        </button>
                    </div>

                    {conv.preview && (
                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-text-dim">
                            {conv.preview}
                        </p>
                    )}

                    <div className="mt-2 flex items-center gap-3 text-[9px] font-black uppercase tracking-wider text-text-dim">
                        <span className="flex items-center gap-1">
                            <History size={9} />
                            {formatDate(conv.updated_at || conv.created_at)}
                        </span>
                        <span>•</span>
                        <span>{msgCount} msgs</span>
                        <span>•</span>
                        <span className="text-accent/80">{tokenCount} tkns</span>
                    </div>
                </div>
            </motion.button>
        );
    };

    return (
        <aside ref={panelRef} className={containerClasses}>
            {isMobile ? (
                <div className="flex items-center justify-between border-b border-border/70 bg-background-elevated p-4 lg:hidden">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-surface">
                            <FileCode size={14} className="text-accent" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wider text-text">ChatID</h2>
                            <p className="text-[9px] text-text-dim">Codex v2.4</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowMoreMenu((value) => !value)}
                            className="rounded-xl border border-border/70 bg-surface p-2 text-text-dim transition-all hover:border-border-strong hover:bg-surface-strong hover:text-text"
                            aria-label="More options"
                        >
                            <MoreVertical size={16} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="rounded-xl border border-border/70 bg-surface p-2 text-text-dim transition-all hover:border-border-strong hover:bg-surface-strong hover:text-text"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </motion.button>
                    </div>
                    <AnimatePresence>{showMoreMenu && <MoreMenu />}</AnimatePresence>
                </div>
            ) : (
                <div className="mb-5 border-b border-border/70 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-surface">
                            <FileCode size={20} className="text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-black uppercase tracking-wider text-text">
                                ChatID Codex
                            </h2>
                            <p className="text-[9px] text-text-dim">v2.4.0 • Active</p>
                        </div>
                        <ProjectCodexButton />
                    </div>
                </div>
            )}

            <div className={`flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-hide ${isMobile ? "px-0" : ""}`}>
                <div className="relative group">
                    <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim transition-colors group-focus-within:text-accent" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search conversations..."
                        className={`app-input w-full pl-10 pr-10 py-2.5 text-[12px] font-medium ${isMobile ? "text-sm" : ""}`}
                    />
                    {searchQuery && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-surface p-1 text-text-dim transition-all hover:bg-surface-strong hover:text-text"
                        >
                            <X size={12} />
                        </motion.button>
                    )}
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onNewConversation}
                        className="app-button-primary flex-1 px-3 py-2.5 text-xs"
                        aria-label="Start new conversation"
                    >
                        <Plus size={14} />
                        <span>New Chat</span>
                    </motion.button>

                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowMoreMenu((value) => !value)}
                            className="rounded-2xl border border-border/70 bg-surface px-3 py-2.5 text-text-muted transition-all hover:border-border-strong hover:bg-surface-strong hover:text-text"
                            aria-label="More options"
                        >
                            <MoreVertical size={18} />
                        </motion.button>
                        <AnimatePresence>{showMoreMenu && <MoreMenu />}</AnimatePresence>
                    </div>
                </div>

                {(filteredConversations.pinned.length > 0 || Object.values(groupedUnpinned).some((group) => group.length > 0)) && (
                    <div className="flex items-center justify-between pt-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-text-dim">
                            Conversations
                        </h3>
                        <span className="text-[9px] font-medium text-text-dim">{conversations.length} total</span>
                    </div>
                )}

                {filteredConversations.pinned.length > 0 && (
                    <div className="space-y-2">
                        <div className="mb-2 flex items-center gap-2">
                            <Pin size={12} className="fill-warning text-warning" />
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-warning/70">
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

                {Object.entries(groupedUnpinned).map(([group, convs]) => (
                    convs.length > 0 && (
                        <div key={group} className="space-y-2">
                            <SectionLabel
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

                {filteredConversations.pinned.length === 0 &&
                    Object.values(groupedUnpinned).every((group) => group.length === 0) && (
                        <div className="flex flex-col items-center justify-center p-8 text-center opacity-60">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-surface">
                                <History size={20} className="text-text-dim" />
                            </div>
                            <p className="text-xs font-medium text-text-muted">
                                {searchQuery ? "No conversations match your search" : "No conversations yet. Start chatting!"}
                            </p>
                        </div>
                    )}

                <div className="h-4" />
            </div>

            {!isMobile && (
                <div className="mt-auto pt-4 border-t border-border/70">
                    <div className="space-y-3 rounded-2xl border border-border/70 bg-surface p-4">
                        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-text-dim">
                            Session Stats
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-dim">Total Chats</span>
                            <span className="text-[11px] font-black text-text">{conversations.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-dim">Today</span>
                            <span className="text-[11px] font-black text-accent">{activeToday}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-dim">Pinned</span>
                            <span className="text-[11px] font-black text-warning">{filteredConversations.pinned.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-dim">Messages</span>
                            <span className="text-[11px] font-black text-text">{totalMsgs}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-dim">Tokens</span>
                            <span className="text-[11px] font-black text-accent">{totalTokens.toLocaleString()}</span>
                        </div>

                        {archivedCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowArchived((value) => !value)}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-[10px] font-medium text-text-muted transition-all hover:border-border-strong hover:bg-surface-strong hover:text-text"
                            >
                                {showArchived ? <Lock size={12} /> : <AlertCircle size={12} />}
                                {showArchived ? "Hide" : "Show"} Archived ({archivedCount})
                            </button>
                        )}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="fixed z-50 w-52 overflow-hidden rounded-2xl border border-border/70 bg-background-elevated shadow-2xl"
                        style={{ top: contextMenu.top, left: contextMenu.left }}
                    >
                        <div className="p-1.5">
                            <button
                                type="button"
                                onClick={() => handleRename(contextMenu)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-text-muted transition hover:bg-surface-strong hover:text-text"
                            >
                                <Edit3 size={13} />
                                Rename
                            </button>
                            <button
                                type="button"
                                onClick={() => togglePin(contextMenu.id)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-text-muted transition hover:bg-surface-strong hover:text-text"
                            >
                                <Pin size={13} />
                                {contextConversation?.is_pinned ? "Unpin" : "Pin"}
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleArchive(contextMenu.id)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-text-muted transition hover:bg-surface-strong hover:text-text"
                            >
                                <Archive size={13} />
                                {contextConversation?.is_archived ? "Unarchive" : "Archive"}
                            </button>
                            <button
                                type="button"
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-text-muted transition hover:bg-surface-strong hover:text-text"
                            >
                                <Copy size={13} />
                                Duplicate
                            </button>
                            <button
                                type="button"
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-text-muted transition hover:bg-surface-strong hover:text-text"
                            >
                                <Download size={13} />
                                Export
                            </button>
                        </div>
                        <div className="border-t border-border/70 p-1.5">
                            <button
                                type="button"
                                onClick={() => handleDeleteClick(contextMenu.id)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-danger transition hover:bg-danger/10"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            className="mx-4 w-full max-w-sm rounded-2xl border border-border/70 bg-background-elevated p-6 shadow-2xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/20">
                                    <Trash2 size={20} className="text-danger" />
                                </div>
                                <h3 className="text-lg font-bold text-text">Delete Conversation?</h3>
                            </div>
                            <p className="mb-6 text-sm text-text-muted">
                                This action cannot be undone. The conversation and all its data will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={cancelDelete}
                                    className="flex-1 rounded-xl border border-border/70 bg-surface px-4 py-2.5 font-medium text-text transition-all hover:border-border-strong hover:bg-surface-strong"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="flex-1 rounded-xl bg-danger px-4 py-2.5 font-medium text-white transition-all hover:bg-danger/90"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
}
