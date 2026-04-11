import { motion } from "framer-motion";
import { useState } from "react";

export default function Header() {
    const [focused, setFocused] = useState(false);

    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

            {/* LEFT */}
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Analytics{" "}
                    <span className="text-blue-500">Overview</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                    Track performance & user activity
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* SEARCH */}
                <motion.div
                    animate={{
                        width: focused ? 260 : 200
                    }}
                    className="flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 transition"
                >
                    <span className="material-symbols-outlined text-gray-400 text-sm mr-2">
                        search
                    </span>

                    <input
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Search metrics..."
                        className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
                    />
                </motion.div>

                {/* NOTIFICATION */}
                <div className="relative cursor-pointer">
                    <span className="material-symbols-outlined text-gray-300 hover:text-white transition">
                        notifications
                    </span>

                    {/* badge */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                </div>

                {/* USER */}
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                        D
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm text-white leading-none">Duy</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>

                    <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition text-sm">
                        expand_more
                    </span>
                </div>
            </div>
        </header>
    );
}