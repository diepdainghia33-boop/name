import React from "react";
import { User, Mail, Lock } from "lucide-react";

export default function SignUp() {
    return (
        <div className="bg-[#0e0e0e] text-white min-h-screen flex flex-col font-['Inter'] overflow-hidden relative">

            {/* Header */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-black/40 backdrop-blur-xl">
                <h1 className="text-[#84adff] font-bold text-lg tracking-wider font-['Space_Grotesk']">
                    Architect AI
                </h1>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                    Back to Home
                </a>
            </header>

            {/* Background glow */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[160px] rounded-full"></div>

            {/* Main */}
            <main className="flex flex-col items-center justify-center flex-1 px-6 pt-28 pb-20 z-10">

                {/* Title */}
                <div className="text-center mb-10 max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk']">
                        Join the future of architecture
                    </h2>
                    <p className="text-gray-400">
                        Create your workspace and start building ethereal structures today.
                    </p>
                </div>

                {/* Form card */}
                <div className="w-full max-w-md 
                    bg-white/[0.03] 
                    backdrop-blur-2xl 
                    rounded-2xl p-8 
                    border border-white/10
                    shadow-[0_0_80px_-20px_rgba(132,173,255,0.25)]">

                    <form className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">
                                Tên đầy đủ
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-5 py-4 rounded-lg 
                                    bg-[#2a2a2a]/80 text-white 
                                    placeholder:text-gray-500 
                                    border border-white/5
                                    focus:border-blue-400/40
                                    focus:ring-2 focus:ring-blue-400/20
                                    outline-none transition"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">
                                Email
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type="email"
                                    placeholder="name@studio.com"
                                    className="w-full px-5 py-4 rounded-lg 
                                    bg-[#2a2a2a]/80 text-white 
                                    placeholder:text-gray-500 
                                    border border-white/5
                                    focus:border-blue-400/40
                                    focus:ring-2 focus:ring-blue-400/20
                                    outline-none transition"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">
                                Mật khẩu
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 rounded-lg 
                                    bg-[#2a2a2a]/80 text-white 
                                    placeholder:text-gray-500 
                                    border border-white/5
                                    focus:border-blue-400/40
                                    focus:ring-2 focus:ring-blue-400/20
                                    outline-none transition"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-full 
                            bg-gradient-to-r from-[#84adff] to-[#6c9fff] 
                            text-black font-semibold 
                            shadow-[0_10px_30px_-10px_rgba(132,173,255,0.6)]
                            hover:opacity-90 active:scale-[0.98] transition"
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-3">
                            <div className="flex-1 h-[1px] bg-gray-700"></div>
                            <span className="text-xs text-gray-500 uppercase">
                                Or continue with
                            </span>
                            <div className="flex-1 h-[1px] bg-gray-700"></div>
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3">

                            {/* Google */}
                            <button className="flex items-center justify-center gap-3 py-3 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-gray-800 text-sm transition">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="google"
                                    className="w-5 h-5"
                                />
                                Google
                            </button>

                            {/* Apple */}
                            <button className="flex items-center justify-center gap-3 py-3 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] border border-gray-800 text-sm transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                    className="w-5 h-5"
                                >
                                    <path d="M16.365 1.43c0 1.14-.465 2.24-1.23 3.05-.78.82-2.05 1.45-3.15 1.36-.14-1.13.41-2.3 1.17-3.08.83-.86 2.2-1.48 3.21-1.33zM21.04 17.17c-.58 1.32-.86 1.91-1.61 3.1-1.04 1.63-2.5 3.66-4.32 3.67-1.62.02-2.04-1.05-4.24-1.04-2.2.01-2.66 1.06-4.28 1.04-1.82-.02-3.21-1.85-4.25-3.48C.89 18.23-.02 15.04 1.1 12.18c.8-2.04 2.25-3.33 3.88-3.36 1.66-.03 3.22 1.12 4.24 1.12 1.02 0 2.93-1.38 4.94-1.18.84.03 3.2.34 4.72 2.56-.12.08-2.82 1.65-2.79 4.92.03 3.91 3.43 5.21 3.45 5.23z" />
                                </svg>
                                Apple
                            </button>

                        </div>
                    </form>

                    {/* Login */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?
                        <a href="#" className="text-blue-400 ml-1 hover:underline">
                            Log In
                        </a>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full flex justify-between px-10 py-6 text-xs text-gray-500">
                <span>© 2024 Architect AI</span>
                <div className="flex gap-6">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Support</a>
                </div>
            </footer>
        </div>
    );
}