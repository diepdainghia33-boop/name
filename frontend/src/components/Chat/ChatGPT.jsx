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
        <div className="flex items-center gap-2 px-4 py-3">
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:240ms]" />
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

function Welcome() {
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10 text-accent">
                <Sparkles size={24} />
            </div>
            <p className="text-lg font-black tracking-tight text-text">Chat with AI</p>
            <p className="mt-2 text-sm text-text-muted">Ask a question, attach a file, or search the web.</p>
        </div>
    );
}

export default function ChatGPT({ messages = [], isLoading, messagesEndRef, showTimestamps, autoScroll = true, onFeedback }) {
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
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-accent">
                            Invoice OCR
                        </p>
                        <p className="mt-1 text-sm font-bold text-text">
                            Trích xuất hóa đơn
                        </p>
                    </div>

                    {confidence !== null && confidence !== undefined && confidence !== "" && (
                        <span className="rounded-full border border-accent/20 bg-background-elevated px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                            {Number(confidence).toFixed(0)}%
                        </span>
                    )}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">Store</p>
                        <p className="mt-1 text-sm font-semibold text-text">{bill.store_name || extracted.store_name || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">Invoice No.</p>
                        <p className="mt-1 text-sm font-semibold text-text">{bill.invoice_number || extracted.invoice_number || "—"}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">Date</p>
                        <p className="mt-1 text-sm font-semibold text-text">{formatBillDate(bill.purchase_date || extracted.purchase_date)}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background-elevated px-3 py-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">Total</p>
                        <p className="mt-1 text-sm font-semibold text-text">
                            {formatBillAmount(bill.total_amount ?? extracted.total_amount, bill.currency || extracted.currency)}
                        </p>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="mt-4 border-t border-border/70 pt-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
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
                                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-text-dim">
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
                        <summary className="cursor-pointer text-[10px] font-black uppercase tracking-[0.22em] text-text-dim">
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
                    <div className="mb-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-accent">
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
                                    code({ inline, children }) {
                                        return inline ? (
                                            <code className="rounded-md bg-background-elevated px-1.5 py-0.5 text-[0.9em] text-accent">
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-background-elevated p-4">
                                                <code className="text-text">{children}</code>
                                            </pre>
                                        );
                                    },
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
            <div className="w-full space-y-6 pb-36">
                {messages.length === 0 && !isLoading && <Welcome />}

                <AnimatePresence>
                    {grouped.map((g, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${g.role === "user" ? "justify-end" : ""}`}
                        >
                            {g.role !== "user" && (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface text-accent">
                                    <Sparkles size={16} />
                                </div>
                            )}

                            <div className={`flex w-fit max-w-[min(72rem,100%)] flex-col gap-2 ${g.role === "user" ? "items-end" : ""}`}>
                                {g.list.map((msg) => (
                                    <div key={msg.id}>
                                        <div
                                            className={`rounded-[24px] border px-4 py-3 text-sm leading-7 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${g.role === "user"
                                                ? "border-accent/25 bg-accent/10 text-text"
                                                : "border-border/70 bg-surface text-text"
                                                }`}
                                        >
                                            {renderContent(msg, g.role)}
                                        </div>

                                        <div className="mt-1 flex items-center justify-between gap-3 px-1 text-xs text-text-dim">
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
