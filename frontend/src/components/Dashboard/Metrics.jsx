import { Shield, Cpu, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Metrics({ data }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            <Card
                icon={<Shield size={24} />}
                label="ACTIVE STATUS"
                title="System Health"
                value={`${data.health || 0}%`}
                color="from-emerald-500 to-green-400"
                textColor="text-emerald-400"
            />
            <Card
                icon={<Cpu size={24} />}
                label="COMPUTING"
                title="Token Usage"
                value={`${((data.tokens || 0) / 1000000).toFixed(1)}M`}
                color="from-blue-500 to-cyan-400"
                textColor="text-blue-400"
            />
            <Card
                icon={<MessageSquare size={24} />}
                label="INTERACTIONS"
                title="Total Conversations"
                value={data.total_messages || 0}
                color="from-cyan-500 to-sky-400"
                textColor="text-cyan-400"
            />
        </motion.section>
    );
}

function Card({ icon, label, title, value, color, textColor }) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            variants={item}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden group cursor-pointer"
        >
            {/* Top glowing gradient line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-70 group-hover:opacity-100 transition-opacity`} />

            {/* Ambient background glow on hover */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500`} />

            {/* 🔹 TOP */}
            <div className="flex items-center justify-between mb-8">
                <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] ${textColor} shadow-lg`}>
                    {icon}
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                        {label}
                    </span>
                </div>
            </div>

            {/* 🔹 CONTENT */}
            <div className="relative z-10">
                <p className="text-sm font-medium text-gray-400 mb-1">
                    {title}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                        {value}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
}
