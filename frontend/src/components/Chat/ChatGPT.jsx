import React, { useEffect } from "react";
import { motion } from "framer-motion";

// ── Lightweight inline markdown renderer ──────────────────────────────────────
function renderMarkdown(text) {
    if (!text) return null;

    const lines = text.split("\n");
    const elements = [];
    let i = 0;
    let keyCounter = 0;
    const key = () => keyCounter++;

    while (i < lines.length) {
        const line = lines[i];

        // Fenced code block
        if (line.startsWith("```")) {
            const lang = line.slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(
                <pre key={key()} className="my-3 rounded-xl overflow-x-auto bg-black/50 border border-white/10 text-[13px] leading-relaxed">
                    {lang && (
                        <div className="px-4 py-1.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400/60">
                            {lang}
                        </div>
                    )}
                    <code className="block px-4 py-3 text-green-300 font-mono whitespace-pre">
                        {codeLines.join("\n")}
                    </code>
                </pre>
            );
            i++;
            continue;
        }

        // Heading 1
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

        // Horizontal rule
        if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
            elements.push(<hr key={key()} className="my-3 border-white/10" />);
            i++; continue;
        }

        // Unordered list item
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

        // Ordered list item
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

        // Blockquote
        if (line.startsWith("> ")) {
            elements.push(
                <blockquote key={key()} className="my-2 pl-4 border-l-2 border-blue-500/50 text-gray-400 italic">
                    {inlineMarkdown(line.slice(2))}
                </blockquote>
            );
            i++; continue;
        }

        // Empty line → spacer
        if (line.trim() === "") {
            elements.push(<div key={key()} className="h-2" />);
            i++; continue;
        }

        // Normal paragraph
        elements.push(<p key={key()} className="leading-relaxed">{inlineMarkdown(line)}</p>);
        i++;
    }

    return elements;
}

// Inline: bold, italic, inline code, links
function inlineMarkdown(text) {
    if (!text) return null;
    const parts = [];
    // Split on **bold**, *italic*, `code`
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

// ─────────────────────────────────────────────────────────────────────────────

export default function ChatGPT({ messages = [], isLoading, messagesEndRef, user }) {
    useEffect(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading, messagesEndRef]);

    return (
        <section className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-32 scrollbar-hide">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Empty state */}
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] opacity-50">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black mb-3 tracking-tight">Architect AI</h3>
                        <p className="text-gray-400 text-center max-w-sm leading-relaxed">
                            Sẵn sàng hỗ trợ bạn. Hãy gõ câu hỏi đầu tiên.
                        </p>
                    </div>
                )}

                {/* Messages */}
                {messages.map((msg, index) => {
                    if (!msg) return null;

                    const isUser      = msg.role === "user";
                    const userInitial = user?.name?.[0]?.toUpperCase() || "U";
                    const sentimentClass = msg.sentiment?.ota_class || "";
                    const messageKey = msg.id || `msg-${msg.role}-${index}-${Date.now()}`;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            key={messageKey}
                            className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 shadow-xl select-none ${
                                !isUser
                                    ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
                                    : "bg-white/5 backdrop-blur-md"
                            }`}>
                                {!isUser ? (
                                    <span className="text-[11px] font-black italic tracking-tight">AI</span>
                                ) : (
                                    <span className="text-[11px] font-black uppercase text-blue-400">{userInitial}</span>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[78%] space-y-1.5 flex flex-col ${
                                isUser ? "items-end" : "items-start"
                            }`}>
                                <div className={`px-5 py-3.5 rounded-[22px] text-[14px] leading-relaxed shadow-xl transition-all duration-300 ${
                                    isUser
                                        ? "bg-blue-600 text-white rounded-tr-sm hover:bg-blue-500"
                                        : "bg-white/[0.04] border border-white/[0.07] text-gray-200 rounded-tl-sm backdrop-blur-xl hover:bg-white/[0.06]"
                                }`}>
                                    {/* Image preview */}
                                    {msg.image_path && (
                                        <div className="mb-3 overflow-hidden rounded-xl border border-white/10 shadow-xl bg-black/40">
                                            <img
                                                src={msg.image_path}
                                                alt="Uploaded"
                                                className="max-w-full h-auto max-h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Content — markdown for bot, plain for user */}
                                    {isUser ? (
                                        <div className="font-medium whitespace-pre-wrap">
                                            {msg.content || "..."}
                                        </div>
                                    ) : (
                                        <div className="font-medium">
                                            {renderMarkdown(msg.content || "...")}
                                        </div>
                                    )}
                                </div>

                                {/* Meta: time + sentiment + tokens */}
                                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider px-1 flex items-center gap-2">
                                    <span>
                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>

                                    {sentimentClass && (
                                        <span className={`px-2 py-0.5 rounded text-[9px] border ${
                                            sentimentClass.startsWith("P")
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
                            </div>
                        </motion.div>
                    );
                })}

                {/* Typing indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                            <span className="text-[11px] font-black italic">AI</span>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.07] px-5 py-4 rounded-[22px] rounded-tl-sm backdrop-blur-xl">
                            <div className="flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}
