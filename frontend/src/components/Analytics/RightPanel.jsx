import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function RightPanel() {
    const [intents, setIntents] = useState([
        { name: "Invoice Analysis", value: 0, color: "#60a5fa" },
        { name: "Architectural Consulting", value: 0, color: "#f472b6" },
        { name: "General Chat", value: 100, color: "#9ca3af" },
    ]);

    useEffect(() => {
        const fetchIntents = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8001/api/analytics");
                if (response.data.intents) {
                    setIntents(response.data.intents);
                }
            } catch (error) {
                console.error("Error fetching intents:", error);
            }
        };
        fetchIntents();
    }, []);

    return (
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

            {/* INTENT CARD */}
            <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-5">
                    <h4 className="font-bold text-white tracking-tight">Intent Distribution</h4>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-widest">REAL-TIME</span>
                </div>

                {/* LIST */}
                <div className="flex flex-col gap-5">
                    {intents.map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-gray-400">{item.name}</span>
                                <span className={item.value > 0 ? "text-white" : "text-gray-600"}>{item.value}%</span>
                            </div>

                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                    className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                    style={{ background: item.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* UPGRADE CARD */}
            <motion.div
                whileHover={{ y: -5 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <h4 className="font-black text-xl mb-3 tracking-tighter italic">Architect AI Gold</h4>
                <p className="text-xs mb-6 text-blue-100 leading-relaxed font-medium">
                    Unlock predictive neural modeling and deep architectural insights.
                </p>
                <button className="w-full bg-white text-blue-700 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
                    Upgrade Now
                </button>
            </motion.div>
        </div>
    );
}