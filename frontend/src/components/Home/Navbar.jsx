import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-16">
            <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tighter uppercase italic">
                    Architect<span className="text-blue-500">.AI</span>
                </span>
            </div>

            <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                <Link to="/" className="text-white">Home</Link>
                <a className="hover:text-white transition-colors cursor-pointer">Features</a>
                <a className="hover:text-white transition-colors cursor-pointer">Workspace</a>
                <a className="hover:text-white transition-colors cursor-pointer">Docs</a>
            </div>

            <div className="flex items-center gap-5">
                <span className="material-symbols-outlined cursor-pointer text-gray-400 hover:text-white transition-colors text-xl">
                    notifications
                </span>
                <Link to="/login" className="h-9 w-9 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 flex items-center justify-center transition-all duration-300 group">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">
                        account_circle
                    </span>
                </Link>
            </div>
        </nav>
    );
}