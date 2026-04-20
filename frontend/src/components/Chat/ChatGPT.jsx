import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ThumbsUp, ThumbsDown, ChevronDown, Sparkles } from "lucide-react";

// ── Utility: relative time ─────────────────────────────────────────────────────
function timeAgo(dateStr) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} d ago`;
}

// ── Utility: copy to clipboard ──────────────────────────────────────────────────
async function copyText(text) {
    await navigator.clipboard.writeText(text);
}

// ── CodeBlock component with copy button ───────────────────────────────────────
function CodeBlock({ language, code, showCopy = true }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await copyText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <pre className="my-3 rounded-xl overflow-x-auto bg-[#0d0d0d] border border-white/10 text-[13px] leading-relaxed relative group">
            {language && (
                <div className="px-4 py-1.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400/60 flex justify-between items-center">
                    <span>{language}</span>
                    {showCopy && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors ${copied ? "bg-green-500/20 text-green-400" : "bg-white/5 hover:bg-white/10 text-gray-400"
                                }`}
                            title="Copy code"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            <span className="text-[9px] font-bold uppercase">{copied ? "Copied!" : "Copy"}</span>
                        </motion.button>
                    )}
                </div>
            )}
            <code className="block px-4 py-3 text-green-300 font-mono whitespace-pre">
                {code}
            </code>
            {!language && showCopy && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-blue-500 text-white rounded-lg transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    title="Copy code"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </motion.button>
            )}
        </pre>
    );
}

// ── Markdown renderer ───────────────────────────────────────────────────────────
function renderMarkdown(text) {
    if (!text) return null;

    const lines = text.split("\n");
    const elements = [];
    let i = 0;
    let keyCounter = 0;
    const key = () => keyCounter++;

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith("```")) {
            const lang = line.slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(
                <CodeBlock key={key()} language={lang} code={codeLines.join("\n")} />
            );
            i++;
            continue;
        }

        if (line.startsWith("### ")) {
            elements.push(<h3 key={key()} className="text-[15px] font-black mt-3 mb-1 text-white/90">{inlineMarkdown(line.slice(4))}</h3>);
            i++; continue;
        }
        if (line.startsWith("## ")) {
            elements.push(<h2 key={key()} className="text-[16px] font-black mt-4 mb-1 text-white">{inlineMarkdown(line.slice(3))}</h2>);
            i++; continue;
        }
        if (line.startsWith("# ")) {
            elements.push(<h1 key={key()} className="text-[18px] font-black mt-4 mb-2 text-white">{inlineMarkdown(line.slice(2))}</h1>);
            i++; continue;
        }

        if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
            elements.push(<hr key={key()} className="my-3 border-white/10" />);
            i++; continue;
        }

        if (line.match(/^[-*+] /)) {
            const listItems = [];
            while (i < lines.length && lines[i].match(/^[-*+] /)) {
                listItems.push(
                    <li key={key()} className="flex gap-2 items-start">
                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                        <span>{inlineMarkdown(lines[i].slice(2))}</span>
                    </li>
                );
                i++;
            }
            elements.push(<ul key={key()} className="my-2 space-y-1 pl-1">{listItems}</ul>);
            continue;
        }

        if (line.match(/^\d+\. /)) {
            const listItems = [];
            let num = 1;
            while (i < lines.length && lines[i].match(/^\d+\. /)) {
                const content = lines[i].replace(/^\d+\. /, "");
                listItems.push(
                    <li key={key()} className="flex gap-2 items-start">
                        <span className="text-blue-400 font-black text-[12px] flex-shrink-0 min-w-[18px]">{num}.</span>
                        <span>{inlineMarkdown(content)}</span>
                    </li>
                );
                i++; num++;
            }
            elements.push(<ol key={key()} className="my-2 space-y-1 pl-1">{listItems}</ol>);
            continue;
        }

        if (line.startsWith("> ")) {
            elements.push(
                <blockquote key={key()} className="my-2 pl-4 border-l-2 border-blue-500/50 text-gray-400 italic">
                    {inlineMarkdown(line.slice(2))}
                </blockquote>
            );
            i++; continue;
        }

        if (line.trim() === "") {
            elements.push(<div key={key()} className="h-2" />);
            i++; continue;
        }

        elements.push(<p key={key()} className="leading-relaxed">{inlineMarkdown(line)}</p>);
        i++;
    }

    return elements;
}

function inlineMarkdown(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let last = 0;
    let m;
    let k = 0;

    while ((m = regex.exec(text)) !== null) {
        if (m.index > last) {
            parts.push(<React.Fragment key={k++}>{text.slice(last, m.index)}</React.Fragment>);
        }
        if (m[2] !== undefined) {
            parts.push(<strong key={k++} className="font-bold text-white">{m[2]}</strong>);
        } else if (m[3] !== undefined) {
            parts.push(<em key={k++} className="italic text-gray-300">{m[3]}</em>);
        } else if (m[4] !== undefined) {
            parts.push(
                <code key={k++} className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-green-300 font-mono text-[12px]">
                    {m[4]}
                </code>
            );
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) {
        parts.push(<React.Fragment key={k++}>{text.slice(last)}</React.Fragment>);
    }
    return parts.length > 0 ? parts : text;
}

// ── Reaction button component ───────────────────────────────────────────────────
function ReactionButton({ reaction, count, onClick, active }) {
    const icons = {
        thumbsUp: ThumbsUp,
        thumbsDown: ThumbsDown
    };
    const Icon = icons[reaction] || ThumbsUp;

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all ${active
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent"
                }`}
            aria-label={`${reaction} reaction${count > 0 ? ` (${count})` : ""}`}
        >
            <Icon size={12} />
            {count > 0 && <span>{count}</span>}
        </motion.button>
    );
}

// ────────────────────────────────────────────────────────────────────────────────

export default function ChatGPT({ messages = [], isLoading, messagesEndRef, user, setUnreadCount = () => { } }) {
    const [showNewMessagesIndicator, setShowNewMessagesIndicator] = useState(false);
    const [streaming, setStreaming] = useState({ id: null, textEnd: 0 });
    const chatContainerRef = useRef(null);

    // Streaming animation for the latest bot message
    useEffect(() => {
        if (isLoading) return;

        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'bot' && lastMsg.id !== streaming.id) {
            // Start streaming new bot message
            const content = lastMsg.content || "";
            if (content.length === 0) return;

            setStreaming({ id: lastMsg.id, textEnd: 0 });

            const interval = setInterval(() => {
                setStreaming(prev => {
                    if (prev.id !== lastMsg.id) {
                        clearInterval(interval);
                        return prev;
                    }
                    const next = Math.min(prev.textEnd + 2, content.length);
                    if (next >= content.length) {
                        clearInterval(interval);
                        return { ...prev, textEnd: content.length };
                    }
                    return { ...prev, textEnd: next };
                });
            }, 20);

            return () => clearInterval(interval);
        }
    }, [isLoading, messages, streaming.id]);

    // Rest of the component...

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef?.current) {
            const isNearBottom = chatContainerRef.current
                ? chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop - chatContainerRef.current.clientHeight < 100
                : false;

            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

            if (!isNearBottom && messages.length > 0) {
                setShowNewMessagesIndicator(true);
            }
        }
    }, [messages, isLoading, messagesEndRef]);

    // Scroll handler to detect if user is at bottom
    const handleScroll = useCallback(() => {
        const container = chatContainerRef.current;
        if (!container) return;
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
        if (isAtBottom) {
            setShowNewMessagesIndicator(false);
            setUnreadCount(0);
        }
    }, []);

    // Group consecutive messages from same sender
    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentGroup = null;

        messages.forEach((msg, idx) => {
            if (!msg) return;

            const isUser = msg.role === "user";
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const shouldGroup = prevMsg && prevMsg.role === msg.role && !prevMsg.isStreaming;

            if (!shouldGroup) {
                currentGroup = {
                    messages: [msg],
                    isUser,
                    key: msg.id || `group-${idx}`
                };
                groups.push(currentGroup);
            } else {
                currentGroup.messages.push(msg);
            }
        });

        return groups;
    }, [messages]);

    const handleReaction = useCallback((msgId, reaction) => {
        // This would dispatch to parent or API in a full implementation
        console.log(`Reaction ${reaction} on message ${msgId}`);
        // TODO: send to backend
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMessagesIndicator(false);
        setUnreadCount(0);
    }, [messagesEndRef]);

    return (
        <section
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-32 scrollbar-hide"
            onScroll={handleScroll}
            aria-label="Chat messages"
            role="log"
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Empty state */}
                {messages.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center min-h-[60vh] opacity-50"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center mb-8 shadow-lg">
                            <Sparkles size={40} className="text-blue-400 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 tracking-tight text-white">Architect AI</h3>
                        <p className="text-gray-400 text-center max-w-sm leading-relaxed">
                            Sẵn sàng hỗ trợ bạn với kiến trúc phần mềm, phân tích dữ liệu, và coding.
                        </p>
                    </motion.div>
                )}

                {/* Message groups */}
                <AnimatePresence mode="popLayout">
                    {groupedMessages.map((group) => {
                        const lastMsg = group.messages[group.messages.length - 1];
                        if (!lastMsg) return null;

                        const sentimentClass = lastMsg.sentiment?.ota_class || "";
                        const userInitial = user?.name?.[0]?.toUpperCase() || "U";

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                key={group.key}
                                className={`flex gap-4 ${group.isUser ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar - shown only for first message in group */}
                                <div
                                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/10 shadow-lg select-none ${!group.isUser
                                            ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
                                            : "bg-white/5 backdrop-blur-sm"
                                        }`}
                                >
                                    {!group.isUser ? (
                                        <span className="text-[11px] font-black italic tracking-tight text-white">AI</span>
                                    ) : (
                                        <span className="text-[11px] font-black uppercase text-blue-400">{userInitial}</span>
                                    )}
                                </div>

                                {/* Bubbles group */}
                                <div className={`max-w-[78%] flex flex-col ${group.isUser ? "items-end" : "items-start"}`}>
                                    {group.messages.map((msg, msgIdx) => {
                                        const isLastInGroup = msgIdx === group.messages.length - 1;
                                        return (
                                            <div key={msg.id || `${group.key}-${msgIdx}`} className="space-y-1.5">
                                                <div
                                                    className={`px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-lg transition-all duration-300 ${group.isUser
                                                            ? "bg-blue-600 text-white rounded-tr-none hover:bg-blue-500"
                                                            : "bg-white/[0.03] border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-sm hover:bg-white/[0.05]"
                                                        }`}
                                                >
                                                    {/* Image preview */}
                                                    {msg.image_path && (
                                                        <div className="mb-3 overflow-hidden rounded-xl border border-white/10 shadow-lg bg-black/40">
                                                            <img
                                                                src={msg.image_path}
                                                                alt="Uploaded"
                                                                className="max-w-full h-auto max-h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    {group.isUser ? (
                                                        <div className="font-medium whitespace-pre-wrap">
                                                            {msg.content || "..."}
                                                        </div>
                                                    ) : (
                                                        <div className="font-medium relative">
                                                            {renderMarkdown(
                                                                streaming.id === msg.id && streaming.textEnd < (msg.content?.length || 0)
                                                                    ? (msg.content || "").slice(0, streaming.textEnd)
                                                                    : msg.content || "..."
                                                            )}
                                                            {/* Streaming cursor */}
                                                            {streaming.id === msg.id && streaming.textEnd < (msg.content?.length || 0) && (
                                                                <span className="inline-block w-2 h-4 bg-blue-500 ml-0.5 align-middle animate-pulse" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Meta: timestamp, sentiment, tokens, reactions */}
                                                {isLastInGroup && (
                                                    <div className="flex items-center justify-between px-1">
                                                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider flex items-center gap-2">
                                                            <time dateTime={msg.created_at} title={new Date(msg.created_at).toLocaleString()}>
                                                                {timeAgo(msg.created_at)}
                                                            </time>

                                                            {sentimentClass && (
                                                                <span className={`px-2 py-0.5 rounded text-[9px] border ${sentimentClass.startsWith("P")
                                                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                                                        : "bg-red-500/10 border-red-500/30 text-red-400"
                                                                    }`}>
                                                                    {sentimentClass}
                                                                </span>
                                                            )}

                                                            {msg.tokens > 0 && (
                                                                <span className="px-2 py-0.5 rounded text-[9px] border bg-indigo-500/10 border-indigo-500/30 text-indigo-400">
                                                                    ⚡ {msg.tokens}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Reactions (only for bot messages) */}
                                                        {!group.isUser && (
                                                            <div className="flex items-center gap-1">
                                                                <ReactionButton
                                                                    reaction="thumbsUp"
                                                                    count={msg.reactions?.thumbsUp || 0}
                                                                    onClick={() => handleReaction(msg.id, "thumbsUp")}
                                                                    active={msg.userReaction === "thumbsUp"}
                                                                />
                                                                <ReactionButton
                                                                    reaction="thumbsDown"
                                                                    count={msg.reactions?.thumbsDown || 0}
                                                                    onClick={() => handleReaction(msg.id, "thumbsDown")}
                                                                    active={msg.userReaction === "thumbsDown"}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg border border-white/10">
                            <span className="text-[11px] font-black italic text-white">AI</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 px-5 py-4 rounded-2xl rounded-tl-none backdrop-blur-sm">
                            <div className="flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} aria-hidden="true" />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} aria-hidden="true" />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} aria-hidden="true" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />

                {/* New messages indicator */}
                <AnimatePresence>
                    {showNewMessagesIndicator && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={scrollToBottom}
                            className="fixed bottom-40 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all"
                            aria-label="Scroll to latest messages"
                        >
                            <ChevronDown size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">New messages</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
