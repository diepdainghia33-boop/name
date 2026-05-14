import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Sparkles, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

function Typing() {
    return (
        <div className="flex items-center gap-1.5 px-5 py-4">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.15 
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                />
            ))}
            <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60">Architect is thinking</span>
        </div>
    );
}

function Reaction({ icon: Icon, onClick, active }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full border p-1.5 transition-colors ${active
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-border/70 text-text-dim hover:border-border hover:bg-surface hover:text-text"
                }`}
        >
            <Icon size={14} />
        </button>
    );
}

function Welcome({ userName, onSuggestionClick }) {
    const suggestions = [
        "Thiết kế hệ thống Microservices cho E-commerce",
        "Phân tích hóa đơn này giúp tôi",
        "Tối ưu hóa query Laravel Eloquent",
        "So sánh React vs Next.js cho dự án lớn"
    ];

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-20 text-center">
            <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 relative"
            >
                <div className="absolute inset-0 bg-accent/20 blur-[30px] rounded-full animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-[32px] border border-accent/20 bg-background-elevated text-accent shadow-2xl">
                    <Sparkles size={32} />
                </div>
            </motion.div>
            
            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-black tracking-tight text-text"
            >
                Chào {userName || "bạn"}, tôi có thể giúp gì?
            </motion.h2>
            
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-sm text-text-muted max-w-md leading-relaxed"
            >
                Tôi là **Architect AI Premium**. Hãy bắt đầu bằng cách đặt câu hỏi kỹ thuật hoặc tải lên một bản vẽ kiến trúc/hóa đơn.
            </motion.p>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex flex-wrap justify-center gap-3"
            >
                {suggestions.map((s, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onSuggestionClick?.(s)}
                        className="rounded-2xl border border-border/70 bg-surface px-5 py-3 text-xs font-bold text-text-muted transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-accent hover:scale-105"
                    >
                        {s}
                    </button>
                ))}
            </motion.div>
        </div>
    );
}

const CodeBlock = ({ inline, children, className }) => {
    const [copied, setCopied] = useState(false);
    const content = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
        return (
            <code className="rounded-md bg-background-elevated px-1.5 py-0.5 text-[0.9em] text-accent font-medium">
                {children}
            </code>
        );
    }

    return (
        <div className="relative group/code my-4">
            <div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated/80 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted backdrop-blur-sm transition-all hover:border-accent/40 hover:text-accent"
                >
                    {copied ? (
                        <>
                            <span className="h-1 w-1 rounded-full bg-success animate-pulse" />
                            Copied
                        </>
                    ) : (
                        "Copy"
                    )}
                </button>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-background-elevated p-5 text-[13px] leading-relaxed">
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
};

export default function ChatGPT({ messages = [], isLoading, messagesEndRef, showTimestamps, autoScroll = true, onFeedback, user, onSendSuggestion }) {
    const [showScroll, setShowScroll] = useState(false);
    const chatRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
        setShowScroll(false);
    }, [messagesEndRef]);

    const handleScroll = () => {
        const el = chatRef.current;
        if (!el) return;
        const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        setShowScroll(!bottom);
    };

    useEffect(() => {
        if (autoScroll) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom, autoScroll]);

    const grouped = useMemo(() => {
        const res = [];
        let cur = null;

        messages.forEach((m) => {
            if (!cur || cur.role !== m.role) {
                cur = { role: m.role, list: [m] };
                res.push(cur);
            } else {
                cur.list.push(m);
            }
        });

        return res;
    }, [messages]);

    const formatBillDate = (value) => {
        if (!value) return "—";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "—";
        return date.toLocaleDateString("vi-VN");
    };

    const formatBillAmount = (value, currency = "VND") => {
        if (value === null || value === undefined || value === "") return "—";
        return `${value} ${currency}`.trim();
    };

    const renderBillSummary = (bill) => {
        if (!bill) return null;

        const items = Array.isArray(bill.items) ? bill.items : [];
        const extracted = bill.extracted_data || {};
        const confidence = bill.confidence_score ?? extracted.confidence;

        return (
            <div className="mb-3 rounded-[20px] border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[0.625rem] font-black uppercase tracking-[0.28em] text-accent">
                            Invoice OCR
                        </p>
                        <p className="mt-1 text-sm font-bold text-text">
                            Trích xuất hóa đơn
                        </p>
                    </div>

                    {confidence !== null && confidence !== undefined && confidence !== "" && (
                        <span className="rounded-full border border-accent/20 bg-background-elevated px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.2em] text-accent">
                            {Number(confidence).toFixed(0)}%
                        </span>
                    )}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[0.5625rem] font-black uppercase tracking-[0.22em] text-text-dim">Store</p>
                        <p className="mt-1 text-sm font-semibold text-text">{bill.store_name || extracted.store_name || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[0.5625rem] font-black uppercase tracking-[0.22em] text-text-dim">Invoice No.</p>
                        <p className="mt-1 text-sm font-semibold text-text">{bill.invoice_number || extracted.invoice_number || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[0.5625rem] font-black uppercase tracking-[0.22em] text-text-dim">Date</p>
                        <p className="mt-1 text-sm font-semibold text-text">{formatBillDate(bill.purchase_date || extracted.purchase_date)}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[0.5625rem] font-black uppercase tracking-[0.22em] text-text-dim">Total</p>
                        <p className="mt-1 text-sm font-semibold text-text">
                            {formatBillAmount(bill.total_amount ?? extracted.total_amount, bill.currency || extracted.currency)}
                        </p>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="mt-4 border-t border-border/70 pt-4">
                        <p className="text-[0.5625rem] font-black uppercase tracking-[0.22em] text-text-dim">
                            Items ({items.length})
                        </p>
                        <div className="mt-2 space-y-2">
                            {items.slice(0, 3).map((item, index) => (
                                <div
                                    key={`${item.id || index}`}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background-elevated px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-text">{item.name || "Unnamed item"}</p>
                                        <p className="mt-1 text-[0.625rem] uppercase tracking-[0.18em] text-text-dim">
                                            Qty {item.quantity ?? 1}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-sm font-bold text-accent">
                                        {item.total != null ? `${item.total} ${bill.currency || extracted.currency || "VND"}` : "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {bill.ocr_text && (
                    <details className="mt-4 rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <summary className="cursor-pointer text-[0.625rem] font-black uppercase tracking-[0.22em] text-text-dim">
                            Raw OCR text
                        </summary>
                        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-6 text-text-muted">
                            {bill.ocr_text}
                        </pre>
                    </details>
                )}
            </div>
        );
    };

    const renderContent = (msg, role) => {
        const hasImage = Boolean(msg.image_path);
        const isBill = msg.type === "bill";

        return (
            <>
                {isBill && (
                    <div className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] text-accent">
                        Hóa đơn
                    </div>
                )}

                {msg.bill && renderBillSummary(msg.bill)}

                {hasImage && (
                    <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background-elevated">
                        <img
                            src={msg.image_path}
                            alt={isBill ? "Uploaded invoice" : "Uploaded image"}
                            className="max-h-[28rem] w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                {msg.content ? (
                    <div className={hasImage ? "mt-3" : ""}>
                        {role === "user" ? (
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code: CodeBlock,
                                    img: ({ src, alt }) => (
                                        <div className="my-4 overflow-hidden rounded-[24px] border border-border/70 bg-background-elevated shadow-xl transition-all hover:shadow-2xl">
                                            <div className="flex items-center justify-between border-b border-border/70 bg-surface/50 px-4 py-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                                    AI Generated Visual
                                                </span>
                                            </div>
                                            <img
                                                src={src}
                                                alt={alt}
                                                className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                                                loading="lazy"
                                            />
                                            {alt && (
                                                <div className="bg-surface/30 px-4 py-2 italic text-[11px] text-text-dim border-t border-border/70">
                                                    {alt}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    a: (props) => (
                                        <a {...props} className="text-accent underline decoration-accent/30 underline-offset-4" target="_blank" rel="noopener noreferrer">
                                            {props.children}
                                        </a>
                                    ),
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ) : null}
            </>
        );
    };

    return (
        <section
            ref={chatRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto bg-background px-4 pt-6 text-text scrollbar-hide sm:px-6 lg:px-8"
        >
            <div className="w-full space-y-8 pb-36">
                {messages.length === 0 && !isLoading && <Welcome userName={user?.name} onSuggestionClick={onSendSuggestion} />}

                <AnimatePresence>
                    {grouped.map((g, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 260, 
                                damping: 20,
                                delay: i * 0.05 
                            }}
                            className={`flex w-full gap-4 ${g.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-2 mt-1">
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-lg relative overflow-hidden ${
                                        g.role === "user" 
                                            ? "border-accent/30 bg-accent/10 text-accent" 
                                            : "border-border/70 bg-background-elevated text-accent shadow-accent/5"
                                    }`}
                                >
                                    {g.role === "user" ? (
                                        <div className="text-[10px] font-black uppercase tracking-tighter">YOU</div>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent pointer-events-none" />
                                        </>
                                    )}
                                </motion.div>
                                <div className="h-full w-0.5 bg-gradient-to-b from-border/50 to-transparent rounded-full opacity-20" />
                            </div>

                            {/* Messages Container */}
                            <div className={`flex flex-col gap-3 max-w-[85%] ${g.role === "user" ? "items-end" : "items-start"}`}>
                                {g.list.map((msg, idx) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, x: g.role === "user" ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative"
                                    >
                                        <div
                                            className={`relative overflow-hidden px-5 py-4 text-[0.9375rem] leading-[1.6] shadow-xl transition-all duration-300 ${
                                                g.role === "user"
                                                    ? "rounded-[28px] rounded-tr-[4px] border-accent/20 bg-accent/10 text-text hover:bg-accent/[0.12]"
                                                    : "rounded-[28px] rounded-tl-[4px] border-border/70 bg-surface text-text hover:border-border shadow-accent/5"
                                            }`}
                                        >
                                            {/* Subtle Bot Glow */}
                                            {g.role !== "user" && (
                                                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-accent/5 blur-[40px] pointer-events-none" />
                                            )}
                                            
                                            <div className="relative z-10">
                                                {renderContent(msg, g.role)}
                                            </div>
                                        </div>

                                        {/* Status & Feedback */}
                                        <div className={`mt-2 flex items-center gap-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${g.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                            {showTimestamps && (
                                                <span className="text-[10px] font-medium uppercase tracking-widest text-text-dim/60">
                                                    {timeAgo(msg.created_at)}
                                                </span>
                                            )}

                                            {g.role !== "user" && (
                                                <div className="flex items-center gap-1.5">
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
                                                    <button className="p-1.5 text-text-dim/40 hover:text-accent transition-colors">
                                                        <span className="text-[10px] font-bold">REGEN</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface text-accent">
                            <Sparkles size={16} />
                        </div>
                        <div className="app-panel rounded-[24px]">
                            <Typing />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {showScroll && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-28 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/70 bg-surface px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-text shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                >
                    <ChevronDown className="h-4 w-4" />
                    New messages
                </button>
            )}
        </section>
    );
}

