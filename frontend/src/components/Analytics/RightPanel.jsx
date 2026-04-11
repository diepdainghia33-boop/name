import { motion } from "framer-motion";

export default function RightPanel() {
    const data = [
        { name: "Support", value: 45, color: "#60a5fa" },
        { name: "Product Info", value: 30, color: "#f472b6" },
        { name: "Account Management", value: 15, color: "#9ca3af" },
    ];

    return (
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

            {/* INTENT CARD */}
            <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-[#1f1f1f]">

                <div className="flex justify-between items-center mb-5">
                    <h4 className="font-semibold text-white">
                        Intent Distribution
                    </h4>

                    <span className="text-xs text-gray-400">
                        This week
                    </span>
                </div>

                {/* LIST */}
                <div className="flex flex-col gap-4">
                    {data.map((item, i) => (
                        <div key={i}>
                            {/* LABEL */}
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-300">
                                    {item.name}
                                </span>
                                <span className="text-gray-500">
                                    {item.value}%
                                </span>
                            </div>

                            {/* BAR */}
                            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{
                                        duration: 1,
                                        delay: i * 0.2,
                                        ease: "easeOut",
                                    }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* LEGEND */}
                <div className="flex gap-4 mt-6 flex-wrap">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ background: item.color }}
                            />
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* UPGRADE CARD */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-400 p-6 rounded-3xl text-black"
            >
                {/* glow background */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>

                <h4 className="font-bold text-lg mb-2">
                    Architect AI Gold
                </h4>

                <p className="text-sm mb-5 text-black/80">
                    Unlock advanced predictive modeling, anomaly detection,
                    and deeper insights for your chatbot analytics.
                </p>

                <button className="bg-black text-white px-5 py-2 rounded-full text-xs hover:bg-white hover:text-black transition">
                    Upgrade Plan
                </button>
            </motion.div>
        </div>
    );
}