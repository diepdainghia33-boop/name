import React, { useState, useEffect } from "react";
import { Search, Bell, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ searchQuery, setSearchQuery, user }) {
  const [stats, setStats] = useState({ cpu_speed: "Init...", thermal: "--" });

  useEffect(() => {
    const fetchStats = () => {
      fetch("http://127.0.0.1:8001/api/stats")
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(() => { });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full px-8 py-5 border-b border-white/5 bg-[#0b0b0b]/60 backdrop-blur-2xl flex items-center justify-between z-40">
      {/* LEFT - Status & Page Title */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-[13px] font-black uppercase tracking-[0.3em] text-white/90">
            Neural Dynamics <span className="text-blue-500">v4</span>
          </h1>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-500">
                System: <span className="text-blue-400">Stable</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              <Cpu size={10} className="text-purple-400" />
              <span className="text-[9px] font-black tracking-widest text-gray-300">{stats.cpu_speed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - Actions & User */}
      <div className="flex items-center gap-6">
        {/* SEARCH BAR (REFINED) */}
        <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all duration-500 px-5 py-2.5 rounded-2xl w-80 focus-within:w-96 group">
          <Search size={14} className="text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query temporal records..."
            className="bg-transparent outline-none text-[13px] ml-4 w-full placeholder-gray-600 font-semibold text-gray-200"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* NOTIFICATIONS */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
          >
            <Bell size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] border border-black"></span>
          </motion.button>

          {/* USER PROFILE MOCK */}
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="text-right hidden xl:block">
              <p className="text-[12px] font-black uppercase tracking-widest text-white leading-none mb-1">{user?.name || "Architect"}</p>
              <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-tighter">Verified Identity</p>
            </div>
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-xl border border-white/10 group-hover:rotate-6 transition-transform">
                <span className="text-[12px] font-black text-white">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b0b0b] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}