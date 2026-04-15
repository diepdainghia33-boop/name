import React, { useState } from "react";
import { Cpu, MessageSquare, History, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RightPanel({
    conversations,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    activeId,
}) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        try {
            await onDeleteConversation(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <aside className="w-72 h-screen bg-[#0e0e0e] border-l border-white/5 p-5 text-white hidden lg:flex flex-col relative z-20">

            {/* New Chat button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNewConversation}
                className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-widest transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
                <Plus size={16} />
                <span>New Chat</span>
            </motion.button>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                <div className="flex items-center justify-between mb-4 opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">History</p>
                    <History size={12} />
                </div>

                <div className="space-y-2">
                    <AnimatePresence>
                        {conversations.length === 0 ? (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center italic text-[11px] text-gray-500">
                                Chưa có cuộc trò chuyện nào.
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }}
                                    whileHover={{ scale: 1.01 }}
                                    key={conv.id}
                                    onClick={() => onSelectConversation(conv.id)}
                                    className={`group p-3.5 rounded-[18px] cursor-pointer transition-all duration-200 border flex items-start gap-3 ${
                                        activeId === conv.id
                                            ? "bg-blue-600/10 border-blue-500/30 shadow-[inset_0_0_16px_rgba(59,130,246,0.05)]"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                                    }`}
                                >
                                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                                        activeId === conv.id ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500"
                                    }`}>
                                        <MessageSquare size={13} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[12px] font-bold truncate leading-snug ${
                                            activeId === conv.id ? "text-white" : "text-gray-400"
                                        }`}>
                                            {conv.title || "New conversation"}
                                        </p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mt-0.5 opacity-60">
                                            {new Date(conv.updated_at || conv.created_at).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => handleDelete(e, conv.id)}
                                        disabled={deletingId === conv.id}
                                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                                    >
                                        {deletingId === conv.id ? (
                                            <div className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 size={12} />
                                        )}
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Core Identity footer */}
            <div className="mt-4 pt-4 border-t border-white/5">
                <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.07] p-5 rounded-[28px] text-center shadow-2xl">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Cpu size={24} className="text-white" />
                    </div>
                    <h2 className="font-black text-[14px] tracking-tight">ARCHITECT.AI</h2>
                    <p className="text-[9px] text-gray-500 mt-1.5 font-bold uppercase tracking-wider leading-relaxed">
                        Groq · llama-3.3-70b
                    </p>
                </div>
            </div>
        </aside>
    );
}
