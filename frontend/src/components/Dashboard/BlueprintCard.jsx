import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function BlueprintCard({ title, onClick, delay = 0 }) {
    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 90 }}
            onClick={onClick}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative h-[200px] overflow-hidden rounded-[28px] border border-border/70 bg-surface text-left shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_36%),linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />

            <div className="relative flex h-full flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                        Blueprint
                    </span>
                    <div className="rounded-full border border-border/70 bg-background-elevated p-2 text-text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                        <ArrowUpRight size={15} />
                    </div>
                </div>

                <div>
                    <div className="mb-3 h-1 w-12 rounded-full bg-accent transition-transform group-hover:scale-x-125" />
                    <h3 className="text-xl font-black tracking-tight text-text transition-colors group-hover:text-accent">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-muted">
                        Click to load schematics
                    </p>
                </div>
            </div>
        </motion.button>
    );
}
