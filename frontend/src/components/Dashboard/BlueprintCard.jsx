import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function BlueprintCard({ title, onClick, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 90 }}
            onClick={onClick}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-2xl overflow-hidden h-[200px] cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5 bg-[#111]"
        >
            <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-in-out mix-blend-luminosity"
            />

            {/* Grandient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

            <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ArrowUpRight size={16} className="text-white" />
            </div>

            <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mb-3 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    Click to load schematics
                </p>
            </div>
        </motion.div>
    );
}
