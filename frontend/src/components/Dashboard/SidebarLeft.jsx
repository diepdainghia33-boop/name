import { Plus, Home, MessageSquare, BarChart3, Settings } from "lucide-react";

// Mapping string icon name sang Lucide icon component
const iconMap = {
    home: <Home size={16} />,
    chat: <MessageSquare size={16} />,
    monitoring: <BarChart3 size={16} />,
    settings: <Settings size={16} />,
};

function NavItem({ icon, text, active }) {
    return (
        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${active
                ? "bg-[#1a1a1a] text-white"
                : "hover:bg-[#141414] text-gray-400 hover:text-white"
                }`}
        >
            {iconMap[icon]}
            <span>{text}</span>
        </div>
    );
}

export default function Sidebar() {
    const menuItems = [
        { text: "Home", icon: "home", active: true },
        { text: "Chat", icon: "chat" },
        { text: "Analytics", icon: "monitoring" },
        { text: "Settings", icon: "settings" },
    ];

    const recentChats = [
        "Skyline Tower Analysis",
        "Eco-Materials Research",
        "Bridge Stress Test",
    ];

    return (
        <aside className="w-64 h-screen bg-[#0b0b0b] border-r border-[#1f1f1f] p-4 flex flex-col">
            {/* Logo */}
            <div className="mb-6 mt-2.5">
                <h1 className="font-bold text-2xl text-blue-500">Architect AI</h1>
                <p className="text-xs text-gray-500">POWERED BY VISION</p>
            </div>

            {/* New Chat Button */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg mb-6 text-sm">
                <Plus size={16} /> New Chat
            </button>

            {/* 📌 NAV */}
            <nav className="space-y-2 mb-6 text-sm">
                {menuItems.map((item) => (
                    <NavItem
                        key={item.text}
                        icon={item.icon}
                        text={item.text}
                        active={item.active}
                    />
                ))}
            </nav>

            {/* Recent Chats */}
            <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">RECENT CHATS</p>
                <div className="space-y-2 text-sm">
                    {recentChats.map((chat) => (
                        <p
                            key={chat}
                            className="hover:text-white text-gray-400 cursor-pointer"
                        >
                            {chat}
                        </p>
                    ))}
                </div>
            </div>

            {/* Profile */}
            <div className="border-t border-[#1f1f1f] pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600" />
                <div>
                    <p className="text-sm text-white">Alex Rivera</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                </div>
            </div>
        </aside>
    );
}