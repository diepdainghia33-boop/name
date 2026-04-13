import React, { useState, useRef } from "react";
import { Send, Paperclip, Mic, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputBar({ onSend }) {
    const [inputValue, setInputValue] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleSend = () => {
        if (inputValue.trim() || selectedImage) {
            onSend(inputValue, selectedImage);
            setInputValue("");
            setSelectedImage(null);
            setPreviewUrl(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent z-30">
            <div className="max-w-3xl mx-auto space-y-4">
                {/* Image Preview Area */}
                <AnimatePresence>
                    {previewUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-blue-500/50 shadow-2xl group"
                        >
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-3 bg-[#181818] border border-white/5 px-4 py-3 rounded-[24px] shadow-2xl backdrop-blur-3xl relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fileInputRef.current.click()}
                        className={`p-2 transition-colors ${selectedImage ? "text-blue-500" : "text-gray-500 hover:text-white"}`}
                    >
                        <Paperclip size={18} />
                    </motion.button>

                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={selectedImage ? "Add a caption..." : "Command the architect..."}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-600 px-2"
                    />

                    <div className="flex items-center gap-2">
                        {!inputValue && !selectedImage && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                            >
                                <Mic size={18} />
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSend}
                            className={`p-3 rounded-[18px] shadow-lg transition-all flex items-center justify-center ${(inputValue || selectedImage)
                                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                                    : "bg-white/5 text-gray-700"
                                }`}
                        >
                            <Send size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}