import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({ onSend, isLoading }) {
    const [inputValue, setInputValue]     = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl]     = useState(null);
    const fileInputRef = useRef(null);
    const textareaRef  = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }, [inputValue]);

    const handleSend = () => {
        if (isLoading) return;
        const trimmed = inputValue.trim();
        if (!trimmed && !selectedImage) return;
        onSend(trimmed, selectedImage);
        setInputValue("");
        setSelectedImage(null);
        setPreviewUrl(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type.startsWith("image/")) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
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
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const canSend = (inputValue.trim() || selectedImage) && !isLoading;

    return (
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent z-30">
            <div className="max-w-4xl mx-auto space-y-3">

                {/* Image preview */}
                <AnimatePresence>
                    {previewUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 8 }}
                            className="relative w-36 h-36 rounded-[24px] overflow-hidden border-2 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)]"
                        >
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
                            >
                                <X size={14} />
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
                        accept="image/*"
                    />

                    {/* Attach */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
                            selectedImage
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                        }`}
                    >
                        <Paperclip size={18} />
                    </motion.button>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder={
                            isLoading
                                ? "AI đang trả lời..."
                                : selectedImage
                                    ? "Thêm mô tả cho ảnh..."
                                    : "Nhắn tin với Architect AI... (Enter gửi, Shift+Enter xuống dòng)"
                        }
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium placeholder:text-gray-600 px-2 text-white resize-none overflow-hidden leading-relaxed disabled:opacity-50"
                        style={{ minHeight: "24px", maxHeight: "160px" }}
                    />

                    {/* Mic (decorative) */}
                    {!inputValue && !selectedImage && !isLoading && (
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

                <p className="text-[9px] text-center text-gray-700 font-bold uppercase tracking-[0.25em] opacity-40">
                    Architect AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                </p>
            </div>
        </div>
    );
}
