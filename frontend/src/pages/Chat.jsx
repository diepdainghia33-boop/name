import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Chat/Header";
import ChatGPT from "../components/Chat/ChatGPT";
import InputBar from "../components/Chat/InputBar";
import RightPanel from "../components/Chat/RightPanel";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";


const API = "http://127.0.0.1:8000/api";

// Debounce hook
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function Chat() {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileConversationsOpen, setMobileConversationsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Debounce search to avoid excessive re-renders
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filtered messages using debounced search
    const filteredMessages = useMemo(() => {
        if (!debouncedSearch.trim()) return messages;
        const q = debouncedSearch.toLowerCase();
        return messages.filter(m => m.content?.toLowerCase().includes(q));
    }, [messages, debouncedSearch]);

    // Scroll to bottom helper
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // ── Auth ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { }
        }
    }, []);

    // ── Fetch conversations ──────────────────────────────────────────────────────
    const fetchConversations = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await axios.get(`${API}/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data || []);
        } catch (err) {
            console.error("fetchConversations error:", err);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // ── Welcome message ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (messages.length === 0 && !isLoading && !activeConversationId) {
            const t = setTimeout(() => {
                setMessages([{
                    id: "welcome",
                    content: `Chào ${user?.name || "bạn"}! Tôi là **Architect AI** — trợ lý thông minh của bạn.\n\nTôi có thể giúp bạn:\n- 💡 Tư vấn kiến trúc phần mềm & hệ thống\n- 📊 Phân tích hóa đơn và chi phí\n- 💻 Viết code, debug, code review\n- ❓ Trả lời mọi câu hỏi kỹ thuật\n\nBạn muốn bắt đầu với điều gì?`,
                    role: "bot",
                    created_at: new Date().toISOString(),
                    sentiment: { ota_class: "P1", confidence: 95 }
                }]);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [messages.length, isLoading, activeConversationId, user?.name]);

    // ── Auto scroll on new messages ──────────────────────────────────────────────
    useEffect(() => {
        scrollToBottom();
    }, [filteredMessages, isLoading, scrollToBottom]);

    // ── Select conversation ───────────────────────────────────────────────────────
    const handleSelectConversation = useCallback(async (id) => {
        if (id === activeConversationId) return;
        setActiveConversationId(id);
        setMobileSidebarOpen(false); // Close mobile sidebar
        setMessages([]);
        setIsLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${API}/conversations/${id}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data || []);
        } catch (err) {
            console.error("loadMessages error:", err);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeConversationId]);

    // ── New conversation ─────────────────────────────────────────────────────────
    const handleNewConversation = useCallback(() => {
        setActiveConversationId(null);
        setMessages([]);
        setMobileSidebarOpen(false);
    }, []);

    // ── Delete conversation ───────────────────────────────────────────────────────
    const handleDeleteConversation = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API}/conversations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(prev => prev.filter(c => c.id !== id));
            if (activeConversationId === id) {
                setActiveConversationId(null);
                setMessages([]);
            }
        } catch (err) {
            console.error("deleteConversation error:", err);
        }
    }, [activeConversationId]);

    // Placeholder handlers - connect to backend later
    const handlePinConversation = useCallback(async (id, pinned) => {
        console.log(`Pin conversation ${id}:`, pinned);
        // TODO: Call API
    }, []);

    const handleArchiveConversation = useCallback(async (id, archived) => {
        console.log(`Archive conversation ${id}:`, archived);
        // TODO: Call API
    }, []);

    const handleRenameConversation = useCallback(async (id, newTitle) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${API}/conversations/${id}`, { title: newTitle }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(prev => prev.map(c =>
                c.id === id ? { ...c, title: newTitle } : c
            ));
        } catch (err) {
            console.error("renameConversation error:", err);
        }
    }, []);

    // ── Send message ──────────────────────────────────────────────────────────────
    const handleSendMessage = useCallback(async (content, image = null, document = null, searchMode = false) => {
        if (!content.trim() && !image && !document) return;

        const formData = new FormData();
        if (content) formData.append("content", content);
        if (activeConversationId) formData.append("conversation_id", activeConversationId);
        if (image) formData.append("image", image);
        if (document) formData.append("file", document);
        if (searchMode) formData.append("search_mode", "1");

        const msgType = document ? "document" : (image ? "image" : "text");

        const tempId = `temp-${Date.now()}`;
        const tempUserMsg = {
            id: tempId,
            content,
            role: "user",
            type: msgType,
            image_path: image ? URL.createObjectURL(image) : null,
            file_path: document ? URL.createObjectURL(document) : null,
            file_type: document ? document.name.split('.').pop() : null,
            created_at: new Date().toISOString(),
            search_mode: searchMode,
        };

        setMessages(prev => prev.filter(m => m.id !== "welcome").concat(tempUserMsg));
        setIsLoading(true);

        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(`${API}/messages/send`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const { conversation_id, user_message, bot_message } = res.data;

            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempId);
                const result = [...withoutTemp];
                if (user_message) result.push(user_message);
                if (bot_message) result.push(bot_message);
                return result;
            });

            if (!activeConversationId && conversation_id) {
                setActiveConversationId(conversation_id);
                await fetchConversations();
            }

        } catch (err) {
            console.error("sendMessage error:", err);

            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempId);
                return [
                    ...withoutTemp,
                    { ...tempUserMsg, id: `u-${Date.now()}` },
                    {
                        id: `err-${Date.now()}`,
                        content: "⚠️ Không thể kết nối đến server. Hãy kiểm tra:\n- Laravel backend (port 8000) đang chạy\n- AI service (port 8001) đang chạy\n- API key đã được cấu hình đúng",
                        role: "bot",
                        created_at: new Date().toISOString(),
                    }
                ];
            });
        } finally {
            setIsLoading(false);
        }
    }, [activeConversationId, fetchConversations]);

    // ── Keyboard shortcuts ────────────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + K: focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) searchInput.focus();
            }
            // Escape: close mobile menus
            if (e.key === 'Escape') {
                setMobileSidebarOpen(false);
                setMobileSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // ── Close mobile sidebar on route change / outside click ─────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileSidebarOpen && !e.target.closest('.sidebar-left')) {
                setMobileSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileSidebarOpen]);

    return (
        <div className="h-screen flex bg-[#0e0e0e] text-white overflow-hidden">
            {/* Mobile overlay */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`sidebar-left fixed lg:static inset-y-0 left-0 z-50 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
                <SidebarLeft
                    user={user}
                    onClose={() => setMobileSidebarOpen(false)}
                />
            </div>

            {/* Main content */}
            <main className="flex-1 ml-0 lg:ml-72 flex flex-col relative text-white bg-[#0e0e0e]">
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    user={user}
                    onMenuToggle={() => setMobileSidebarOpen(prev => !prev)}
                    onConversationsToggle={() => setMobileConversationsOpen(prev => !prev)}
                    showMobileSearch={() => setMobileSearchOpen(prev => !prev)}
                />

                {/* Mobile search bar */}
                <AnimatePresence>
                    {mobileSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden px-4 py-3 bg-[#0b0b0b] border-b border-white/5 overflow-hidden"
                        >
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search messages..."
                                    className="w-full bg-white/[0.03] border border-white/10 pl-10 pr-10 py-2.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/10"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile conversations drawer overlay */}
                <AnimatePresence>
                    {mobileConversationsOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                                onClick={() => setMobileConversationsOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="lg:hidden fixed inset-y-0 right-0 w-72 max-w-[85vw] z-50"
                            >
                                <RightPanel
                                    conversations={conversations}
                                    onSelectConversation={(id) => {
                                        handleSelectConversation(id);
                                        setMobileConversationsOpen(false);
                                    }}
                                    onNewConversation={() => {
                                        handleNewConversation();
                                        setMobileConversationsOpen(false);
                                    }}
                                    onDeleteConversation={handleDeleteConversation}
                                    onPinConversation={handlePinConversation}
                                    onArchiveConversation={handleArchiveConversation}
                                    onRenameConversation={handleRenameConversation}
                                    activeId={activeConversationId}
                                    isMobile={true}
                                    onClose={() => setMobileConversationsOpen(false)}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <ChatGPT
                        messages={filteredMessages}
                        isLoading={isLoading}
                        messagesEndRef={messagesEndRef}
                        user={user}
                    />
                    <InputBar onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </main>

            {/* Right Panel */}
            <RightPanel
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                onPinConversation={handlePinConversation}
                onArchiveConversation={handleArchiveConversation}
                onRenameConversation={handleRenameConversation}
                activeId={activeConversationId}
                isMobile={false}
            />
        </div>
    );
}
