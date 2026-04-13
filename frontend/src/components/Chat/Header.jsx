import React from "react";
import { Search, Bell } from "lucide-react";

export default function Header({ searchQuery, setSearchQuery, user }) {
  return (
    <header className="w-full px-6 py-4 border-b border-[#1f1f1f] bg-[#0b0b0b]/80 backdrop-blur flex items-center justify-between z-10">

      {/* LEFT */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Neural Architecture Console
        </h1>
        <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-1 font-black uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6] animate-pulse"></span>
          Matrix Sync:
          <span className="text-blue-400">
            Active
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-[#141414] border border-white/5 hover:bg-[#1a1a1a] transition-all duration-200 px-4 py-2 rounded-full w-64 focus-within:ring-1 focus-within:ring-blue-500/50">
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search context..."
            className="bg-transparent outline-none text-xs ml-3 w-full placeholder-gray-600 font-medium"
          />
        </div>

        {/* NOTIFICATION */}
        <button className="relative text-gray-400 hover:text-white transition p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
        </button>

        {/* DYNAMIC USER */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/10 group cursor-pointer">
          <div className="hidden lg:block text-right">
            <p className="text-[11px] font-black uppercase tracking-widest text-white">{user?.name || "Architect"}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Authorized</p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/10 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[10px] font-black uppercase text-white">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}