import { Cpu, FileText, FileSpreadsheet, FileArchive, Info, MessageSquare, History } from "lucide-react";
import { motion } from "framer-motion";

export default function RightPanel({ conversations, onSelectConversation, activeId }) {
    return (
        <aside className="w-80 h-screen bg-[#0e0e0e] border-l border-white/5 p-6 text-white hidden lg:flex flex-col relative z-20">
            {/* History Section */}
            <div className="mb-10 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div className="flex items-center justify-between mb-6 opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Memory</p>
                    <History size={14} />
                </div>

                <div className="space-y-3">
                    {conversations.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center italic text-[11px] text-gray-500">
                            No active neural records found.
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={conv.id}
                                onClick={() => onSelectConversation(conv.id)}
                                className={`p-4 rounded-[20px] cursor-pointer transition-all duration-300 border ${activeId === conv.id
                                    ? "bg-blue-600/10 border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]"
                                    : "bg-white/2 border-white/5 hover:bg-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl ${activeId === conv.id ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500"}`}>
                                        <MessageSquare size={14} />
                                    </div>
                                    <p className={`text-[13px] font-bold truncate ${activeId === conv.id ? "text-white" : "text-gray-400"}`}>
                                        {conv.title || "Neural Session"}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center opacity-40">
                                    <span className="text-[9px] font-black uppercase tracking-widest">{new Date(conv.created_at).toLocaleDateString()}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Shared Assets */}
            <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">Shared Assets</p>
                <div className="space-y-3">
                    <FileItem icon={<FileText size={16} />} name="blueprint_layer_0.dwg" />
                    <FileItem icon={<FileArchive size={16} />} name="stress_test_analysis.zip" />
                </div>
            </div>

            {/* Core Identity */}
            <div className="mt-auto">
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 rounded-[32px] text-center shadow-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Cpu size={32} className="text-white" />
                    </div>
                    <h2 className="font-black text-lg tracking-tight">ARCHITECT.AI</h2>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider leading-relaxed">
                        Precision Structural Core v4.28
                    </p>
                </div>
            </div>
        </aside>
    );
}

function FileItem({ icon, name }) {
    return (
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 cursor-pointer transition-all group">
            <div className="text-gray-500 group-hover:text-blue-400 transition-colors">{icon}</div>
            <span className="text-[12px] font-semibold truncate text-gray-400 group-hover:text-white transition-colors">{name}</span>
        </div>
    );
}