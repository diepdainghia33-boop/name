import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, X, Mic, Globe, FileText, FileSpreadsheet, Image as ImageIcon, File, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({ onSend, isLoading, sendOnEnter = true }) {
    const [inputValue, setInputValue] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchMode, setSearchMode] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [inputValue]);

    useEffect(() => {
        return () => {
            selectedFiles.forEach((f) => {
                if (f.preview && typeof f.preview === "string" && f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
                if (f.preview && typeof f.preview === "object" && f.preview.url) URL.revokeObjectURL(f.preview.url);
            });
        };
    }, [selectedFiles]);

    const processFile = useCallback((file) => {
        const fileType = getFileType(file);
        let preview = null;

        if (fileType === "image") {
            preview = URL.createObjectURL(file);
        } else if (fileType === "pdf" || fileType === "excel") {
            preview = {
                name: file.name,
                type: fileType,
                size: (file.size / 1024 / 1024).toFixed(2),
                url: URL.createObjectURL(file),
            };
        }

        return { file, preview, type: fileType };
    }, []);

    const getFileType = (file) => {
        if (file.type.startsWith("image/")) return "image";
        if (file.type === "application/pdf") return "pdf";
        if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.type === "text/csv") return "excel";
        return "unknown";
    };

    const handleFiles = useCallback(
        (files) => {
            const newFiles = Array.from(files).map(processFile).filter((f) => f.type !== "unknown");
            setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
        },
        [processFile]
    );

    const handleSend = () => {
        if (isLoading) return;
        const trimmed = inputValue.trim();
        const hasContent = trimmed || selectedFiles.length > 0;
        if (!hasContent) return;

        const images = selectedFiles.filter((f) => f.type === "image").map((f) => f.file);
        const documents = selectedFiles.filter((f) => f.type !== "image").map((f) => f.file);

        onSend(trimmed, images.length > 0 ? images[0] : null, documents.length > 0 ? documents[0] : null, searchMode);

        setInputValue("");
        setSelectedFiles([]);
        setSearchMode(false);
        selectedFiles.forEach((f) => {
            if (f.preview && typeof f.preview === "string" && f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
            if (f.preview && typeof f.preview === "object" && f.preview.url) URL.revokeObjectURL(f.preview.url);
        });
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files) handleFiles(files);
        e.target.value = "";
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey && sendOnEnter) {
            e.preventDefault();
            handleSend();
        }
    };

    const removeFile = (index) => {
        const file = selectedFiles[index];
        if (file.preview) {
            if (typeof file.preview === "string" && file.preview.startsWith("blob:")) URL.revokeObjectURL(file.preview);
            if (typeof file.preview === "object" && file.preview.url) URL.revokeObjectURL(file.preview.url);
        }
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleSearchMode = () => setSearchMode(!searchMode);

    const canSend = (inputValue.trim() || selectedFiles.length > 0) && !isLoading;

    const getPlaceholder = () => {
        if (isLoading) return "AI is replying...";
        if (selectedFiles.some((f) => f.type === "pdf" || f.type === "excel")) return "Add a note for the file...";
        if (selectedFiles.some((f) => f.type === "image")) return "Describe the image...";
        if (searchMode) return "Search the web...";
        return "Message Architect AI... (Enter to send, Shift+Enter for a new line)";
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const files = e.dataTransfer.files;
            if (files) handleFiles(files);
        },
        [handleFiles]
    );

    const getFileIcon = (type) => {
        switch (type) {
            case "image":
                return <ImageIcon size={18} className="text-accent" />;
            case "pdf":
                return <FileText size={18} className="text-danger" />;
            case "excel":
                return <FileSpreadsheet size={18} className="text-success" />;
            default:
                return <File size={18} className="text-text-dim" />;
        }
    };

    return (
        <div
            className={`absolute bottom-0 left-0 z-30 w-full bg-gradient-to-t from-background via-background to-transparent px-4 pb-4 pt-4 sm:px-6 lg:px-8 ${
                isDragging ? "bg-accent/5" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="relative mx-auto w-full max-w-[72rem] space-y-3">
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-[32px] border border-dashed border-accent/40 bg-background-elevated/90 backdrop-blur-sm"
                        >
                            <div className="flex flex-col items-center gap-3 text-accent">
                                <Upload size={48} />
                                <p className="text-sm font-black uppercase tracking-[0.3em]">Drop files here</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        <AnimatePresence>
                            {selectedFiles.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.92, y: 8 }}
                                    className="relative"
                                >
                                    {item.type === "image" ? (
                                        <div className="aspect-square overflow-hidden rounded-[22px] border border-border/70 bg-surface">
                                            <img src={item.preview} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center rounded-[22px] border border-border/70 bg-surface px-4 py-4">
                                            {getFileIcon(item.type)}
                                            <p className="mt-3 w-full truncate text-center text-[10px] font-bold text-text" title={item.file.name}>
                                                {item.file.name}
                                            </p>
                                            <p className="mt-1 text-[9px] text-text-dim">{item.preview.size} MB</p>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background-elevated text-text-muted shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-colors hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                                        aria-label={`Remove file ${idx + 1}`}
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <div className="flex items-end gap-3 rounded-[28px] border border-border/70 bg-surface px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.22)] focus-within:border-accent/50 focus-within:bg-surface-strong">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.xlsx,.xls,.csv"
                        multiple
                        aria-label="Attach files"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`mb-0.5 flex-shrink-0 rounded-2xl border px-2.5 py-2 transition-colors ${
                            selectedFiles.length > 0
                                ? "border-accent/30 bg-accent/10 text-accent"
                                : "border-border/70 bg-background-elevated text-text-dim hover:border-accent/40 hover:text-text"
                        }`}
                        title="Attach files (images, PDF, Excel)"
                    >
                        <Paperclip size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={toggleSearchMode}
                        className={`mb-0.5 flex-shrink-0 rounded-2xl border px-2.5 py-2 transition-colors ${
                            searchMode
                                ? "border-success/30 bg-success/10 text-success"
                                : "border-border/70 bg-background-elevated text-text-dim hover:border-accent/40 hover:text-text"
                        }`}
                        title="Web search mode"
                        aria-pressed={searchMode}
                    >
                        <Globe size={18} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder={getPlaceholder()}
                        disabled={isLoading}
                        className="min-h-[24px] flex-1 resize-none border-none bg-transparent px-2 text-[14px] leading-relaxed text-text placeholder:text-text-dim outline-none"
                        style={{ maxHeight: "160px" }}
                        aria-label="Message input"
                    />

                    {!inputValue && selectedFiles.length === 0 && !isLoading && (
                        <button
                            type="button"
                            className="mb-0.5 flex-shrink-0 rounded-2xl border border-border/70 bg-background-elevated p-2 text-text-dim transition-colors hover:border-accent/40 hover:text-text"
                            title="Voice input (coming soon)"
                            aria-label="Voice input"
                        >
                            <Mic size={18} />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`mb-0.5 inline-flex flex-shrink-0 items-center gap-2 rounded-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.24em] transition-colors ${
                            canSend
                                ? "bg-accent text-background hover:bg-accent-strong"
                                : "cursor-not-allowed bg-background-elevated text-text-dim"
                        }`}
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                        ) : (
                            <>
                                <span>Send</span>
                                <Send size={14} />
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between gap-3 px-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-text-dim">
                        Architect AI can make mistakes. Verify important information.
                    </p>
                    {searchMode && (
                        <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.18em] text-success">
                            <Globe size={10} />
                            Web search active
                        </p>
                    )}
                    {selectedFiles.length > 0 && (
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-accent">
                            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} attached
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
