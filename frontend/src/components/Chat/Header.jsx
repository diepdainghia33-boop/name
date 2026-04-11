import { Search, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full px-6 py-4 border-b border-[#1f1f1f] bg-[#0b0b0b]/80 backdrop-blur flex items-center justify-between">

      {/* LEFT */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-lg font-semibold tracking-tight">
          Project Horizon Phase 2
        </h1>
        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span>
          Model:
          <span className="text-gray-300 font-medium">
            Architect (Optimized)
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-[#141414] hover:bg-[#1a1a1a] transition-all duration-200 px-3 py-2 rounded-xl w-64 focus-within:ring-1 focus-within:ring-blue-500 focus-within:bg-[#1a1a1a]">
          <Search size={14} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search context..."
            className="bg-transparent outline-none text-sm ml-2 w-full placeholder-gray-500"
          />
        </div>

        {/* NOTIFICATION */}
        <button className="relative text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-[#141414]">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_6px_#3b82f6]"></span>
        </button>

        {/* AVATAR */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 hover:shadow-blue-500/30 transition-all duration-200">
          <span className="text-xs font-semibold tracking-wide">AR</span>
        </div>
      </div>
    </header>
  );
}