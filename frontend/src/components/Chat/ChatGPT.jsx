import React from "react";
import { motion } from "framer-motion";

export default function ChatGPT({ messages, isLoading, messagesEndRef }) {
    return (
        <section className="flex-1 overflow-y-auto px-6 py-6 pb-28 scrollbar-hide">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full mt-20 opacity-40">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center mb-6">
                           <div className="w-8 h-8 rounded-xl bg-blue-500 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Initialize Architect AI</h3>
                        <p className="text-sm text-center max-w-xs">Ask anything about structural design, urban planning or material science.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id || index} 
                        className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 shadow-xl ${
                            msg.role === "bot" 
                            ? "bg-gradient-to-br from-blue-600 to-indigo-700" 
                            : "bg-white/10"
                        }`}>
                            {msg.role === "bot" ? (
                                <span className="text-[10px] font-black italic">AI</span>
                            ) : (
                                <span className="text-[10px] font-black uppercase">{msg.user?.name?.charAt(0) || "U"}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div className={`px-6 py-4 rounded-3xl text-[14px] leading-relaxed shadow-lg ${
                                msg.role === "user" 
                                ? "bg-blue-600 text-white rounded-tr-none" 
                                : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md"
                            }`}>
                                {msg.image_path && (
                                    <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 shadow-inner bg-black/20">
                                        <img 
                                            src={msg.image_path} 
                                            alt="Uploaded" 
                                            className="max-w-full h-auto max-h-80 object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-2">
                                {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center animate-pulse">
                            <span className="text-[10px] font-black italic">AI</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none">
                            <div className="flex gap-1.5 pt-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}