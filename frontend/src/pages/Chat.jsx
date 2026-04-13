import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Chat/Header";
import ChatGPT from "../components/Chat/ChatGPT";
import InputBar from "../components/Chat/InputBar";
import RightPanel from "../components/Chat/RightPanel";

export default function Chat() {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const messagesEndRef = useRef(null);

    const filteredMessages = React.useMemo(() => {
        if (!searchQuery) return messages;
        return messages.filter(m => 
            m.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/conversations", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(response.data);
            if (response.data.length > 0 && !activeConversationId) {
                // Optionally select the first conversation
                // handleSelectConversation(response.data[0].id);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const handleSelectConversation = async (id) => {
        setActiveConversationId(id);
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:8000/api/conversations/${id}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (content, file = null) => {
        if (!content.trim() && !file) return;

        // Create FormData for the request
        const formData = new FormData();
        if (content) formData.append("content", content);
        if (activeConversationId) formData.append("conversation_id", activeConversationId);
        if (file) formData.append("image", file);

        // Optimistic UI update
        const tempUserMsg = {
            id: Date.now(),
            content,
            role: "user",
            type: file ? "image" : "text",
            image_path: file ? URL.createObjectURL(file) : null,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://127.0.0.1:8000/api/messages/send", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            // If it was a new conversation, update the ID and list
            if (!activeConversationId) {
                setActiveConversationId(response.data.conversation_id);
                fetchConversations();
            }

            // Replace optimistic UI with real data and add bot response
            setMessages(prev => {
                const filtered = prev.filter(m => m.id !== tempUserMsg.id);
                return [...filtered, response.data.user_message, response.data.bot_message];
            });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="h-screen flex bg-[#0e0e0e] text-white overflow-hidden">
            <SidebarLeft user={user} />

            <main className="flex-1 flex flex-col relative text-white">
                <Header 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    user={user}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ChatGPT 
                        messages={filteredMessages} 
                        isLoading={isLoading} 
                        messagesEndRef={messagesEndRef}
                    />
                    <InputBar onSend={handleSendMessage} />
                </div>
            </main>

            <RightPanel
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                activeId={activeConversationId}
            />
        </div>
    );
}