import { Plus, Home, MessageSquare, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const iconMap = {
    home: <Home size={18} />,
    chat: <MessageSquare size={18} />,
    monitoring: <BarChart3 size={18} />,
    settings: <Settings size={18} />,
};

function NavItem({ icon, text, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group"
        >
            {/* active bg animation */}
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-[#1a1a1a] rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            )}

            <div
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                    }`}
            >
                {iconMap[icon]}
                <span>{text}</span>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const [active, setActive] = useState("Home");

    const menuItems = [
        { text: "Home", icon: "home" },
        { text: "Chat", icon: "chat" },
        { text: "Analytics", icon: "monitoring" },
        { text: "Settings", icon: "settings" },
    ];


    return (
        <aside className="w-64 h-screen bg-[#0b0b0b] border-r border-[#1f1f1f] p-4 flex flex-col">

            {/* LOGO */}
            <div className="mb-6 mt-2">
                <h1 className="font-bold text-2xl text-blue-500 tracking-tight">
                    Architect AI
                </h1>
                <p className="text-xs text-gray-500">
                    Powered by Vision
                </p>
            </div>



            {/* NAV */}
            <nav className="space-y-1 mb-6 text-sm">
                {menuItems.map((item) => (
                    <NavItem
                        key={item.text}
                        icon={item.icon}
                        text={item.text}
                        active={active === item.text}
                        onClick={() => setActive(item.text)}
                    />
                ))}
            </nav>

            {/* RECENT CHATS */}
            <div className="flex-1">



            </div>
            <div className="mt-auto">

                {/* NEW CHAT */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl mb-4 text-sm font-medium transition"
                >
                    <Plus size={16} />
                    New Chat
                </motion.button>

                {/* PROFILE */}
                <div className="bg-[#151515] rounded-2xl p-3 flex items-center gap-3 border border-[#1f1f1f]">

                    {/* AVATAR */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                            A
                        </div>

                        {/* ONLINE DOT */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border border-black rounded-full" />
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                        <p className="text-sm text-white leading-none">
                            Alex Rivera
                        </p>
                        <p className="text-xs text-gray-500">
                            Pro Plan
                        </p>
                    </div>

                    {/* OPTIONAL ACTION (menu icon) */}
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        ⋮
                    </div>
                </div>

            </div>
        </aside>
    );
}