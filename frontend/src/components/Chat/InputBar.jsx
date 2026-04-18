import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, Mic, Globe, FileText, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({ onSend, isLoading }) {
    const [inputValue, setInputValue]     = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);
    const [documentPreview, setDocumentPreview] = useState(null);
    const [searchMode, setSearchMode] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef  = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [inputValue]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            if (documentPreview) URL.revokeObjectURL(documentPreview);
        };
    }, []);

    const handleSend = () => {
        if (isLoading) return;
        const trimmed = inputValue.trim();
        if (!trimmed && !selectedImage && !documentFile) return;
        onSend(trimmed, selectedImage, documentFile, searchMode);
        setInputValue("");
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setDocumentFile(null);
        setDocumentPreview(null);
        setSearchMode(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type.startsWith("image/")) {
            // Handle image
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setDocumentFile(null);
            setDocumentPreview(null);
        } else if (
            file.type === "application/pdf" ||
            file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel" ||
            file.type === "text/csv"
        ) {
            // Handle document (PDF/Excel)
            if (documentPreview) URL.revokeObjectURL(documentPreview);
            setDocumentFile(file);
            setDocumentPreview({
                name: file.name,
                type: file.type.includes("pdf") ? "pdf" : "excel",
                size: (file.size / 1024 / 1024).toFixed(2), // MB
                url: URL.createObjectURL(file)
            });
            setSelectedImage(null);
            setImagePreviewUrl(null);
        }
        // Reset so same file can be re-selected
        e.target.value = "";
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Shift+Enter inserts a newline (default textarea behavior)
    };

    const removeImage = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setSelectedImage(null);
        setImagePreviewUrl(null);
    };

    const removeDocument = () => {
        if (documentPreview) {
            URL.revokeObjectURL(documentPreview.url);
        }
        setDocumentFile(null);
        setDocumentPreview(null);
    };

    const toggleSearchMode = () => {
        setSearchMode(!searchMode);
    };

    const canSend = (inputValue.trim() || selectedImage || documentFile) && !isLoading;

    // Determine placeholder text
    const getPlaceholder = () => {
        if (isLoading) return "AI đang trả lời...";
        if (documentFile) return "Thêm mô tả cho file...";
        if (selectedImage) return "Thêm mô tả cho ảnh...";
        if (searchMode) return "Tìm kiếm thông tin trên web...";
        return "Nhắn tin với Architect AI... (Enter gửi, Shift+Enter xuống dòng)";
    };

    return (
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent z-30">
            <div className="max-w-4xl mx-auto space-y-3">

                {/* Image preview */}
                <AnimatePresence>
                    {imagePreviewUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 8 }}
                            className="relative w-36 h-36 rounded-[24px] overflow-hidden border-2 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)]"
                        >
                            <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Document preview */}
                <AnimatePresence>
                    {documentPreview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 8 }}
                            className="relative flex items-center gap-3 p-4 rounded-[20px] overflow-hidden border-2 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)] bg-white/[0.03]"
                        >
                            <div className={`p-3 rounded-xl ${
                                documentPreview.type === "pdf"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-green-500/20 text-green-400"
                            }`}>
                                {documentPreview.type === "pdf" ? (
                                    <FileText size={24} />
                                ) : (
                                    <FileSpreadsheet size={24} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {documentPreview.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {documentPreview.size} MB
                                </p>
                            </div>
                            <button
                                onClick={removeDocument}
                                className="p-2 bg-black/40 hover:bg-red-500 text-white rounded-xl transition-all duration-200"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input bar */}
                <div className="flex items-end gap-3 bg-white/[0.03] border border-white/10 px-5 py-3.5 rounded-[28px] shadow-2xl backdrop-blur-3xl focus-within:border-blue-500/40 transition-all duration-400">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf,.xlsx,.xls,.csv"
                    />

                    {/* Attach button */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
                            selectedImage || documentFile
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                        }`}
                    >
                        <Paperclip size={18} />
                    </motion.button>

                    {/* Search mode toggle */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={toggleSearchMode}
                        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
                            searchMode
                                ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                                : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                        }`}
                        title="Web Search Mode"
                    >
                        <Globe size={18} />
                    </motion.button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder={getPlaceholder()}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium placeholder:text-gray-600 px-2 text-white resize-none overflow-hidden leading-relaxed disabled:opacity-50"
                        style={{ minHeight: "24px", maxHeight: "160px" }}
                    />

                    {/* Mic (decorative) */}
                    {!inputValue && !selectedImage && !documentFile && !isLoading && (
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            className="p-2 text-gray-500 hover:text-blue-400 transition-colors bg-white/5 rounded-xl flex-shrink-0 mb-0.5"
                        >
                            <Mic size={18} />
                        </motion.button>
                    )}

                    {/* Send */}
                    <motion.button
                        whileHover={canSend ? { scale: 1.05 } : {}}
                        whileTap={canSend ? { scale: 0.95 } : {}}
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`flex-shrink-0 mb-0.5 px-5 py-2.5 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2 font-black text-[11px] uppercase tracking-widest ${
                            canSend
                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 cursor-pointer"
                                : "bg-white/5 text-gray-700 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Send</span>
                                <Send size={14} />
                            </>
                        )}
                    </motion.button>
                </div>

                <div className="flex items-center justify-between px-2">
                    <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.25em] opacity-40">
                        Architect AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                    </p>
                    {searchMode && (
                        <p className="text-[9px] text-green-400 font-bold uppercase tracking-[0.15em] flex items-center gap-1">
                            <Globe size={10} />
                            Web Search Active
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
