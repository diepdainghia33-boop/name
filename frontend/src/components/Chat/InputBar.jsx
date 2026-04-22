import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, X, Mic, Globe, FileText, FileSpreadsheet, Image as ImageIcon, File, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({ onSend, isLoading, sendOnEnter = true }) {
    const [inputValue, setInputValue]     = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); // Array of {file, preview, type}
    const [searchMode, setSearchMode]       = useState(false);
    const [isDragging, setIsDragging]       = useState(false);
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
            selectedFiles.forEach(f => {
                if (f.preview && typeof f.preview === 'string' && f.preview.startsWith('blob:')) URL.revokeObjectURL(f.preview);
                if (f.preview && typeof f.preview === 'object' && f.preview.url) URL.revokeObjectURL(f.preview.url);
            });
        };
    }, [selectedFiles]);

    const processFile = useCallback((file) => {
        const fileType = getFileType(file);
        let preview = null;

        if (fileType === 'image') {
            preview = URL.createObjectURL(file);
        } else if (fileType === 'pdf' || fileType === 'excel') {
            preview = {
                name: file.name,
                type: fileType,
                size: (file.size / 1024 / 1024).toFixed(2),
                url: URL.createObjectURL(file)
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

    const handleFiles = useCallback((files) => {
        const newFiles = Array.from(files).map(processFile).filter(f => f.type !== 'unknown');
        setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }, [processFile]);

    const handleSend = () => {
        if (isLoading) return;
        const trimmed = inputValue.trim();
        const hasContent = trimmed || selectedFiles.length > 0;
        if (!hasContent) return;

        // Collect all files to send together
        const images = selectedFiles.filter(f => f.type === 'image').map(f => f.file);
        const documents = selectedFiles.filter(f => f.type !== 'image').map(f => f.file);

        // Send once with all attachments
        onSend(trimmed, images.length > 0 ? images[0] : null, documents.length > 0 ? documents[0] : null, searchMode);

        // Reset state
        setInputValue("");
        setSelectedFiles([]);
        setSearchMode(false);
        selectedFiles.forEach(f => {
            if (f.preview && typeof f.preview === 'string' && f.preview.startsWith('blob:')) URL.revokeObjectURL(f.preview);
            if (f.preview && typeof f.preview === 'object' && f.preview.url) URL.revokeObjectURL(f.preview.url);
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
            if (typeof file.preview === 'string' && file.preview.startsWith('blob:')) URL.revokeObjectURL(file.preview);
            if (typeof file.preview === 'object' && file.preview.url) URL.revokeObjectURL(file.preview.url);
        }
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleSearchMode = () => setSearchMode(!searchMode);

    const canSend = (inputValue.trim() || selectedFiles.length > 0) && !isLoading;

    const getPlaceholder = () => {
        if (isLoading) return "AI đang trả lời...";
        if (selectedFiles.some(f => f.type === 'pdf' || f.type === 'excel')) return "Thêm mô tả cho file...";
        if (selectedFiles.some(f => f.type === 'image')) return "Thêm mô tả cho ảnh...";
        if (searchMode) return "Tìm kiếm thông tin trên web...";
        return "Nhắn tin với Architect AI... (Enter gửi, Shift+Enter xuống dòng)";
    };

    // Drag & drop handlers
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

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files) handleFiles(files);
    }, [handleFiles]);

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon size={20} className="text-purple-400" />;
            case 'pdf': return <FileText size={20} className="text-red-400" />;
            case 'excel': return <FileSpreadsheet size={20} className="text-green-400" />;
            default: return <File size={20} className="text-gray-400" />;
        }
    };

    return (
        <div
            className={`absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent z-30 transition-all duration-300 ${isDragging ? 'bg-blue-900/20' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="max-w-5xl mx-auto space-y-3">

                {/* Drag overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm border-2 border-dashed border-blue-500/50 rounded-3xl pointer-events-none"
                        >
                            <div className="flex flex-col items-center gap-3 text-blue-300">
                                <Upload size={48} className="animate-bounce" />
                                <p className="text-lg font-bold uppercase tracking-wider">Drop files here</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* File previews grid */}
                {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <AnimatePresence>
                            {selectedFiles.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="relative group"
                                >
                                    {item.type === 'image' ? (
                                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)]">
                                            <img src={item.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="relative flex flex-col items-center p-4 rounded-2xl border-2 border-blue-500/50 shadow-[0_0_24px_rgba(59,130,246,0.25)] bg-white/[0.03] backdrop-blur-sm">
                                            {getFileIcon(item.type)}
                                            <p className="text-[10px] font-bold text-gray-300 mt-2 text-center truncate w-full" title={item.file.name}>
                                                {item.file.name}
                                            </p>
                                            <p className="text-[9px] text-gray-500">{item.preview.size} MB</p>
                                        </div>
                                    )}

                                    {/* Remove button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeFile(idx)}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg z-10"
                                        aria-label={`Remove file ${idx + 1}`}
                                    >
                                        <X size={12} />
                                    </motion.button>

                                    {/* File index badge */}
                                    <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0e0e0e]">
                                        {idx + 1}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Input bar */}
                <div className="flex items-end gap-3 bg-white/[0.03] border border-white/10 px-5 py-3.5 rounded-2xl shadow-lg backdrop-blur-sm focus-within:border-blue-500/40 focus-within:bg-white/[0.05] transition-all duration-300">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.xlsx,.xls,.csv"
                        multiple
                        aria-label="Attach files"
                    />

                    {/* Attach button */}
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 mb-0.5 ${
                            selectedFiles.length > 0
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-500 hover:text-white bg-white/5 hover:bg-white/10"
                        }`}
                        title="Attach files (images, PDF, Excel)"
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
                        aria-pressed={searchMode}
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
                        aria-label="Message input"
                    />

                    {/* Mic (decorative, can be connected to speech-to-text later) */}
                    {!inputValue && selectedFiles.length === 0 && !isLoading && (
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            className="p-2 text-gray-500 hover:text-blue-400 transition-colors bg-white/5 rounded-xl flex-shrink-0 mb-0.5"
                            title="Voice input (coming soon)"
                            aria-label="Voice input"
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
                        aria-label="Send message"
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

                {/* Footer */}
                <div className="flex items-center justify-between px-2">
                    <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.25em] opacity-40">
                        Architect AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                    </p>
                    {searchMode && (
                        <motion.p
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[9px] text-green-400 font-bold uppercase tracking-[0.15em] flex items-center gap-1"
                        >
                            <Globe size={10} />
                            Web Search Active
                        </motion.p>
                    )}
                    {selectedFiles.length > 0 && (
                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.15em]">
                            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} attached
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
