import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Chat/Header";
import ChatGPT from "../components/Chat/ChatGPT";
import InputBar from "../components/Chat/InputBar";
import RightPanel from "../components/Chat/RightPanel";

const API = "http://127.0.0.1:8000/api";

export default function Chat() {
    const [user, setUser]                           = useState(null);
    const [conversations, setConversations]         = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages]                   = useState([]);
    const [isLoading, setIsLoading]                 = useState(false);
    const [searchQuery, setSearchQuery]             = useState("");
    const messagesEndRef = useRef(null);

    const filteredMessages = React.useMemo(() => {
        if (!searchQuery.trim()) return messages;
        const q = searchQuery.toLowerCase();
        return messages.filter(m => m.content?.toLowerCase().includes(q));
    }, [messages, searchQuery]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // ── Auth: load user from localStorage ─────────────────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch {}
        }
    }, []);

    // ── Fetch conversations list from Laravel ──────────────────────────────────
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

    // ── Welcome message on empty chat ──────────────────────────────────────────
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
    }, [messages.length, isLoading, activeConversationId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // ── Select / load a conversation ───────────────────────────────────────────
    const handleSelectConversation = useCallback(async (id) => {
        if (id === activeConversationId) return;
        setActiveConversationId(id);
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

    // ── Start a brand-new conversation ────────────────────────────────────────
    const handleNewConversation = useCallback(() => {
        setActiveConversationId(null);
        setMessages([]);
    }, []);

    // ── Delete a conversation ──────────────────────────────────────────────────
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

    // ── Send a message ─────────────────────────────────────────────────────────
    const handleSendMessage = useCallback(async (content, file = null) => {
        if (!content.trim() && !file) return;

        const formData = new FormData();
        if (content)                  formData.append("content", content);
        if (activeConversationId)     formData.append("conversation_id", activeConversationId);
        if (file)                     formData.append("image", file);

        // Optimistic user message
        const tempId = `temp-${Date.now()}`;
        const tempUserMsg = {
            id: tempId,
            content,
            role: "user",
            type: file ? "image" : "text",
            image_path: file ? URL.createObjectURL(file) : null,
            created_at: new Date().toISOString(),
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

            // Replace temp message with real data from server
            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempId);
                const result = [...withoutTemp];
                if (user_message) result.push(user_message);
                if (bot_message)  result.push(bot_message);
                return result;
            });

            if (!activeConversationId && conversation_id) {
                setActiveConversationId(conversation_id);
                await fetchConversations();
            }

        } catch (err) {
            console.error("sendMessage error:", err);

            // On failure keep user message, show error bot msg
            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempId);
                return [
                    ...withoutTemp,
                    { ...tempUserMsg, id: `u-${Date.now()}` },
                    {
                        id: `err-${Date.now()}`,
                        content: "⚠️ Không thể kết nối đến server. Hãy kiểm tra:\n- Laravel backend (port 8000) đang chạy\n- AI service (port 8001) đang chạy",
                        role: "bot",
                        created_at: new Date().toISOString(),
                    }
                ];
            });
        } finally {
            setIsLoading(false);
        }
    }, [activeConversationId, fetchConversations]);

    return (
        <div className="h-screen flex bg-[#0e0e0e] text-white overflow-hidden">
            <SidebarLeft user={user} />

            <main className="flex-1 ml-72 flex flex-col relative text-white bg-gradient-to-b from-[#0e0e0e] to-[#121212]">
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    user={user}
                />
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

            <RightPanel
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                activeId={activeConversationId}
            />
        </div>
    );
}
