import { Home, MessageSquare, BarChart3, Settings, Search, Sparkles, LogOut, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const iconMap = {
    home: Home,
    chat: MessageSquare,
    monitoring: BarChart3,
    settings: Settings,
};

function NavItem({ icon: Icon, text, active, onClick }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex w-full items-center gap-3 rounded-[20px] border px-4 py-3 text-left transition-all duration-200 ${
                active
                    ? "border-accent/30 bg-accent/10 text-text"
                    : "border-transparent bg-transparent text-muted hover:border-border/70 hover:bg-surface hover:text-text"
            }`}
        >
            <Icon size={18} className={active ? "text-accent" : "text-muted group-hover:text-accent"} />
            <span className="text-[13px] font-bold tracking-tight">{text}</span>
            {active && <span className="ml-auto h-2 w-2 rounded-full bg-accent" />}
        </motion.button>
    );
}

export default function Sidebar({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "Overview", icon: "home", path: "/dashboard" },
        { text: "AI Chat", icon: "chat", path: "/chat" },
        { text: "Analytics", icon: "monitoring", path: "/analytics" },
        { text: "Configurations", icon: "settings", path: "/settings" },
    ];

    return (
        <aside className="sidebar-left-scroll fixed left-0 top-0 z-[100] flex h-dvh w-72 flex-col overflow-y-auto overscroll-contain border-r border-border/70 bg-background/95 backdrop-blur-xl">
            <div className="p-6 max-[900px]:p-5">
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate("/dashboard")}
                    className="flex w-full items-center gap-3 rounded-[24px] border border-border/70 bg-surface px-4 py-4 text-left transition-colors hover:border-accent/40 hover:bg-surface-strong max-[900px]:py-3.5"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent max-[900px]:h-10 max-[900px]:w-10">
                        <Sparkles size={18} />
                    </div>
                    <div className="leading-tight">
                        <h1 className="font-display text-xl font-black tracking-tight text-text max-[900px]:text-[1.05rem]">
                            Architect AI
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                            Core system
                        </p>
                    </div>
                </motion.button>
            </div>

            <div className="px-6 max-[900px]:px-5">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search commands..."
                        className="app-input pl-11 text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 px-4 py-6 max-[900px]:py-4">
                <div className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.32em] text-muted max-[900px]:mb-2">
                    Master control
                </div>
                <div className="space-y-2 max-[900px]:space-y-1.5">
                    {menuItems.map((item) => {
                        const Icon = iconMap[item.icon];
                        return (
                            <NavItem
                                key={item.text}
                                icon={Icon}
                                text={item.text}
                                active={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="px-6 pb-6 max-[900px]:px-5 max-[900px]:pb-5">
                <div className="app-panel-muted mb-5 rounded-[28px] p-5 max-[1400px]:mb-4 max-[1400px]:rounded-[24px] max-[1400px]:p-4 max-[900px]:mb-4 max-[900px]:p-4">
                    <div className="mb-4 flex items-center justify-between max-[1400px]:mb-3 max-[900px]:mb-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted max-[1400px]:tracking-[0.26em]">
                                Upgrade
                            </p>
                            <h3 className="mt-2 text-lg font-black tracking-tight text-text max-[1400px]:mt-1 max-[1400px]:text-[1rem] max-[900px]:mt-1 max-[900px]:text-base">
                                Architect Pro
                            </h3>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent max-[1400px]:h-9 max-[1400px]:w-9 max-[900px]:h-9 max-[900px]:w-9">
                            <Plus size={16} />
                        </div>
                    </div>
                    <p className="text-sm leading-7 text-text-muted max-[1400px]:hidden max-[900px]:hidden">
                        Unlock longer context, richer history, and a larger operational window.
                    </p>
                    <button className="app-button-primary mt-4 w-full max-[1400px]:mt-0 max-[1400px]:py-3 max-[1400px]:text-[0.7rem] max-[900px]:mt-0 max-[900px]:py-3">
                        Upgrade now
                    </button>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-border/70 bg-surface p-4 max-[1400px]:gap-3 max-[1400px]:p-3 max-[900px]:gap-3 max-[900px]:p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background-elevated text-text max-[900px]:h-10 max-[900px]:w-10">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-text max-[900px]:text-[0.82rem]">
                            {user?.name || "Architect"}
                        </p>
                        <p className="truncate text-[10px] font-black uppercase tracking-[0.28em] text-muted max-[900px]:hidden">
                            System operator
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}
                        className="rounded-full border border-border/70 p-2 text-muted transition-colors hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                        aria-label="Sign out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
