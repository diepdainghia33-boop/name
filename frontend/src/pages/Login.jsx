export default function AuthPage() {
    return (
        <div className="relative bg-[#0e0e0e] text-white min-h-screen flex flex-col overflow-hidden">

            {/* ===== GLOBAL GLOW BACKGROUND ===== */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full"></div>

            {/* ===== HEADER ===== */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="text-lg font-semibold tracking-wide text-blue-400">
                    Architect AI
                </div>

                <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                    Help
                </a>
            </header>

            {/* ===== MAIN ===== */}
            <main className="flex-grow flex items-center justify-center pt-20">

                <div className="w-full max-w-[1440px] grid md:grid-cols-2 min-h-[820px] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

                    {/* ===== LEFT SIDE ===== */}
                    <div className="hidden md:flex relative items-center justify-center p-12 bg-[#111] overflow-hidden">

                        {/* background image */}
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                            alt="architecture"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                        />

                        {/* overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent"></div>

                        {/* glow */}
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full"></div>

                        {/* content */}
                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-5xl font-bold leading-tight mb-6">
                                Ethereal <br />
                                Digital <br />
                                Structures
                            </h2>

                            <p className="text-gray-400 text-lg leading-relaxed">
                                Transforming blueprints into intelligent environments
                                through AI.
                            </p>

                            <div className="mt-12 flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-blue-400"></div>
                                <span className="text-blue-400 text-xs uppercase tracking-widest">
                                    Visionary Design
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT SIDE ===== */}
                    <div className="flex flex-col justify-center items-center px-6 md:px-20 py-12 bg-black/40 backdrop-blur-2xl">

                        <div className="w-full max-w-md">

                            {/* title */}
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Please enter your details to sign in.
                                </p>
                            </div>

                            {/* GOOGLE BUTTON */}
                            <button className="w-full h-12 flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg mb-8 transition-all duration-300">
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="google"
                                    className="w-5 h-5"
                                />
                                <span className="text-sm">Continue with Google</span>
                            </button>

                            {/* divider */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-[1px] bg-white/10"></div>
                                <span className="text-xs text-gray-400 uppercase">
                                    or email
                                </span>
                                <div className="flex-1 h-[1px] bg-white/10"></div>
                            </div>

                            {/* FORM */}
                            <form className="space-y-6">

                                {/* EMAIL */}
                                <div>
                                    <label className="text-xs text-gray-400 uppercase">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="architect@studio.ai"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <div className="flex justify-between">
                                        <label className="text-xs text-gray-400 uppercase">
                                            Password
                                        </label>
                                        <a href="#" className="text-blue-400 text-xs hover:underline">
                                            Forgot?
                                        </a>
                                    </div>

                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                {/* BUTTON */}
                                <button className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 transition font-semibold shadow-lg shadow-blue-500/30">
                                    Sign In
                                </button>
                            </form>

                            {/* bottom */}
                            <p className="text-center mt-10 text-sm text-gray-400">
                                New here?{" "}
                                <a href="#" className="text-blue-400 hover:underline">
                                    Request access
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="py-6 flex flex-col md:flex-row justify-between items-center px-8 text-xs text-gray-500 border-t border-white/5">

                <span>© 2026 Architect AI</span>

                <div className="flex gap-6 mt-2 md:mt-0">
                    <a href="#" className="hover:text-white transition">Privacy</a>
                    <a href="#" className="hover:text-white transition">Terms</a>
                    <a href="#" className="hover:text-white transition">Support</a>
                </div>
            </footer>
        </div>
    );
}