import { Shield, Cpu, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Metrics({ data }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
            <Card
                icon={<Shield size={22} />}
                label="ACTIVE STATUS"
                title="System Health"
                value={data.health === null || data.health === undefined ? "--" : `${data.health}%`}
                color="text-success"
                bg="bg-success/10"
                borderColor="border-success/20"
            />
            <Card
                icon={<Cpu size={22} />}
                label="COMPUTING"
                title="Token Usage"
                value={`${((data.tokens || 0) / 1000000).toFixed(1)}M`}
                color="text-accent"
                bg="bg-accent/10"
                borderColor="border-accent/20"
            />
            <Card
                icon={<MessageSquare size={22} />}
                label="INTERACTIONS"
                title="Total Conversations"
                value={data.total_messages || 0}
                color="text-warning"
                bg="bg-warning/10"
                borderColor="border-warning/20"
            />
        </motion.section>
    );
}

function Card({ icon, label, title, value, color, bg, borderColor }) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <motion.div
            variants={item}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`group relative overflow-hidden rounded-[28px] border ${borderColor} bg-surface p-6 shadow-[0_16px_40px_rgba(0,0,0,0.24)]`}
        >
            <div className={`absolute inset-0 ${bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            <div className="relative z-10 mb-8 flex items-center justify-between">
                <div className={`rounded-2xl border ${borderColor} ${bg} p-3 ${color}`}>
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                    {label}
                </span>
            </div>

            <div className="relative z-10">
                <p className="text-sm font-medium text-text-muted">{title}</p>
                <h3 className="mt-1 text-4xl font-black tracking-tight text-text">{value}</h3>
            </div>
        </motion.div>
    );
}
