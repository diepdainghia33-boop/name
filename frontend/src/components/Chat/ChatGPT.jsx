import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Sparkles, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ================= TIME ================= */
function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

/* ================= TYPING ================= */
function Typing() {
    return (
        <div className="flex gap-2 items-center px-4 py-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
        </div>
    );
}

/* ================= REACTION ================= */
function Reaction({ icon: Icon, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`p-1.5 rounded-md transition ${active ? 'text-blue-400 bg-blue-400/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
            <Icon size={14} />
        </button>
    );
}

/* ================= WELCOME ================= */
function Welcome() {
    return (
        <div className="text-center py-20 opacity-70">
            <Sparkles className="mx-auto mb-3 text-blue-400" />
            <p className="text-white text-lg font-medium">Chat with AI</p>
            <p className="text-gray-400 text-sm">Ask me anything...</p>
        </div>
    );
}

/* ================= MAIN ================= */

export default function ChatGPT({ messages = [], isLoading, messagesEndRef, showTimestamps, autoScroll = true, onFeedback }) {

    const [showScroll, setShowScroll] = useState(false);
    const chatRef = useRef(null);

    /* ===== SCROLL ===== */
    const scrollToBottom = useCallback(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
        setShowScroll(false);
    }, [messagesEndRef]);

    const handleScroll = () => {
        const el = chatRef.current;
        if (!el) return;

        const bottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 100;

        setShowScroll(!bottom);
    };

    useEffect(() => {
        if (autoScroll) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom, autoScroll]);
    /* ===== GROUP MESSAGE ===== */
    const grouped = useMemo(() => {
        const res = [];
        let cur = null;

        messages.forEach(m => {
            if (!cur || cur.role !== m.role) {
                cur = { role: m.role, list: [m] };
                res.push(cur);
            } else cur.list.push(m);
        });

        return res;
    }, [messages]);

    return (
        <section
            ref={chatRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto bg-[#0f0f10] text-white pt-[50px] px-3 scrollbar-hide"
        >
            {/* CONTAINER giống ChatGPT */}
            <div className="max-w-7xl mx-auto space-y-8 w-full pb-32">

                {/* WELCOME */}
                {messages.length === 0 && !isLoading && <Welcome />}

                {/* CHAT */}
                <AnimatePresence>
                    {grouped.map((g, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${g.role === "user" ? "justify-end" : ""}`}
                        >
                            {/* avatar AI */}
                            {g.role !== "user" && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                                    AI
                                </div>
                            )}

                            {/* bubble */}
                            <div className="flex flex-col gap-2 max-w-[85%]">

                                {g.list.map(msg => (
                                    <div key={msg.id}>
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${g.role === "user"
                                                ? "bg-blue-600 text-white ml-auto"
                                                : "bg-[#1a1a1a] border border-white/10"
                                                }`}
                                        >
                                            {g.role === "user" ? (
                                                msg.content
                                            ) : (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ inline, children }) {
                                                            return inline ? (
                                                                <code className="bg-white/10 px-1 rounded">
                                                                    {children}
                                                                </code>
                                                            ) : (
                                                                <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto">
                                                                    <code>{children}</code>
                                                                </pre>
                                                            );
                                                        },
                                                        a: (props) => (
                                                            <a {...props} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{props.children}</a>
                                                        )
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            )}
                                        </div>

                                        {/* meta */}
                                        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                                            {showTimestamps && <span>{timeAgo(msg.created_at)}</span>}

                                            {g.role !== "user" && (
                                                <div className="flex gap-1">
                                                    <Reaction
                                                        icon={ThumbsUp}
                                                        active={msg.feedback === 1}
                                                        onClick={() => onFeedback?.(msg.id, msg.feedback === 1 ? 0 : 1)}
                                                    />
                                                    <Reaction
                                                        icon={ThumbsDown}
                                                        active={msg.feedback === -1}
                                                        onClick={() => onFeedback?.(msg.id, msg.feedback === -1 ? 0 : -1)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* typing */}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                            AI
                        </div>
                        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10">
                            <Typing />
                        </div>
                    </div>
                )}

                {/* anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* scroll button */}
            {showScroll && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-2 rounded-full text-sm shadow-lg z-40"
                >
                    <ChevronDown className="inline w-4 h-4 mr-1" />
                    New messages
                </button>
            )}
        </section>
    );
}