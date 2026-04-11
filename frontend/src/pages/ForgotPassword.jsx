import React from "react";
import { ArrowLeft, Info } from "lucide-react";

export default function ForgotPassword() {
    return (
        <div className="bg-[#050507] text-white min-h-screen flex flex-col font-['Inter'] relative overflow-hidden">

            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[140px] animate-pulse" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 px-10 h-20 flex justify-between items-center bg-black/20 backdrop-blur-2xl border-b border-white/5">
                <div className="text-lg font-semibold tracking-wide text-[#9ec1ff] font-['Space_Grotesk']">
                    Architect AI
                </div>
                <a href="#" className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-all duration-300 hover:gap-3">
                    <ArrowLeft size={16} />
                    Back to Login
                </a>
            </header>

            {/* Main */}
            <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative z-10">

                <div className="w-full max-w-md">

                    {/* Floating Icon */}
                    <div className="flex justify-center mb-12">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-2xl opacity-70 group-hover:opacity-100 transition duration-700"></div>

                            <div className="relative w-20 h-20 flex items-center justify-center 
                                bg-gradient-to-br from-white/10 to-white/5 
                                backdrop-blur-xl border border-white/10 
                                rounded-2xl shadow-[0_0_40px_rgba(120,160,255,0.2)]
                                group-hover:scale-105 transition duration-500">
                                <span className="text-3xl text-blue-300">🏗️</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-light mb-3 font-['Space_Grotesk'] tracking-tight">
                            Restore Access
                        </h1>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                            Enter your professional email and we'll send you a secure reset link.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="relative group">

                        {/* Glow border */}
                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/30 via-transparent to-purple-500/30 opacity-0 group-hover:opacity-100 blur transition duration-700"></div>

                        <div className="relative bg-white/[0.03] backdrop-blur-3xl p-8 rounded-2xl border border-white/10 shadow-[0_0_80px_-20px_rgba(120,160,255,0.2)]">

                            <form className="space-y-7">

                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">
                                        Registered Email
                                    </label>

                                    <div className="relative group/input">
                                        <input
                                            type="email"
                                            placeholder="name@studio.com"
                                            className="w-full py-4 px-5 rounded-xl 
                                            bg-white/[0.05] text-white 
                                            placeholder:text-gray-500
                                            border border-white/10
                                            focus:border-blue-400/50
                                            focus:ring-2 focus:ring-blue-400/20
                                            outline-none transition-all duration-300"
                                        />

                                        {/* animated glow line */}
                                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 group-focus-within/input:w-full transition-all duration-500"></div>
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-full 
                                    bg-gradient-to-r from-[#9ec1ff] via-[#84adff] to-[#7aa7ff]
                                    text-black text-sm font-semibold tracking-wide
                                    shadow-[0_10px_40px_-10px_rgba(130,170,255,0.6)]
                                    hover:shadow-[0_0_40px_rgba(130,170,255,0.4)]
                                    hover:scale-[1.02]
                                    active:scale-[0.98]
                                    transition-all duration-300"
                                >
                                    Send Reset Link
                                </button>
                            </form>

                            {/* Info */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                                <Info className="text-blue-400/70 mt-0.5" size={16} />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Didn’t receive an email? Check your spam folder or contact{" "}
                                    <a href="#" className="text-blue-400 hover:underline">
                                        Support Studio
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="mt-12 flex justify-center gap-2 opacity-30">
                        <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                        <div className="w-1 h-1 rounded-full bg-blue-400/60"></div>
                        <div className="w-1 h-1 rounded-full bg-blue-400/30"></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <div>© 2024 Architect AI</div>
                <div className="flex gap-6 mt-2 md:mt-0">
                    <a href="#" className="hover:text-blue-400 transition">Privacy</a>
                    <a href="#" className="hover:text-blue-400 transition">Terms</a>
                    <a href="#" className="hover:text-blue-400 transition">Support</a>
                </div>
            </footer>
        </div>
    );
}