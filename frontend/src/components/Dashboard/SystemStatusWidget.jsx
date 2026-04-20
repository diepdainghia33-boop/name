import { motion } from "framer-motion";

export default function SystemStatusWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden"
        >
            <h3 className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.3em] font-bold text-[#adaaaa] mb-6">
                System Status
            </h3>
            <div className="space-y-6">
                {/* Neural Engine */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85adff] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#85adff]"></span>
                        </div>
                        <span className="text-xs font-bold text-white">Neural Engine</span>
                    </div>
                    <span className="text-[10px] font-['Space_Grotesk'] text-[#85adff]">OPERATIONAL</span>
                </div>

                {/* Vector DB */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#8097ff]"></div>
                        <span className="text-xs font-bold text-white">Vector DB</span>
                    </div>
                    <span className="text-[10px] font-['Space_Grotesk'] text-[#8097ff]">SYNCED</span>
                </div>

                {/* CPU Mini Graph */}
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-['Space_Grotesk'] text-[#adaaaa]">CPU LOAD</span>
                        <span className="text-[10px] font-['Space_Grotesk'] text-white">42%</span>
                    </div>
                    <div className="flex gap-[2px] h-8 items-end">
                        <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                        <div className="flex-1 bg-[#1a1919] h-2/3 rounded-sm"></div>
                        <div className="flex-1 bg-[#85adff] h-3/4 rounded-sm"></div>
                        <div className="flex-1 bg-[#85adff] h-1/3 rounded-sm"></div>
                        <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                        <div className="flex-1 bg-[#1a1919] h-3/4 rounded-sm"></div>
                        <div className="flex-1 bg-[#85adff] h-full rounded-sm shadow-[0_0_8px_rgba(133,173,255,0.4)]"></div>
                        <div className="flex-1 bg-[#1a1919] h-2/3 rounded-sm"></div>
                        <div className="flex-1 bg-[#1a1919] h-1/2 rounded-sm"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
