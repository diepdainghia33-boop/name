export default function Hero() {
    return (
        <section className="relative pt-64 pb-24 px-6 overflow-hidden bg-black text-white">

            {/* BACKGROUND BLUR */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 blur-[140px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 max-w-[1400px] mx-auto">

                {/* ===== TOP ===== */}
                <div className="text-center mb-80">

                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                        <span className="text-xs uppercase tracking-widest text-gray-400">
                            Intelligence Evolved
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6">
                        The Future of AI is{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                            Here
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Experience a conversational interface that understands context,
                        creates structure, and builds the future alongside you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold hover:scale-105 transition duration-300 shadow-lg">
                            Try it Now
                        </button>

                        <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition">
                            View Showreel
                        </button>
                    </div>
                </div>

                {/* ===== GRID ===== */}
                <div className="grid grid-cols-12 gap-10 mt-48 items-stretch">

                    {/* LEFT */}
                    <div className="col-span-12 lg:col-span-8 h-[520px] md:h-[680px] lg:h-[760px] rounded-3xl overflow-hidden relative group">

                        {/* glow border */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-pink-500/20 blur-xl"></div>

                        <div className="relative h-full rounded-3xl border border-white/10 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1677442135136-760c813028c0"
                                alt="AI"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                            {/* glass card */}
                            <div className="absolute bottom-8 left-8 right-8 backdrop-blur-2xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
                                <h4 className="font-semibold text-xl mb-2">Neural Architecture</h4>
                                <p className="text-sm text-gray-300">
                                    Real-time processing of complex data structures
                                </p>

                                <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[70%] h-full bg-gradient-to-r from-blue-400 to-pink-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-12 lg:col-span-4">

                        {/* PANEL BACKGROUND */}
                        <div className="relative h-full rounded-3xl p-4 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">

                            {/* glow */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-pink-500/10 blur-xl"></div>

                            <div className="relative grid grid-rows-2 gap-6 h-full">

                                {/* CARD 1 */}
                                <div className="rounded-2xl bg-white/5 p-8 lg:p-10 border border-white/10 flex flex-col justify-between hover:bg-white/10 hover:-translate-y-1 transition duration-300">

                                    <div className="text-pink-400 text-4xl">💬</div>

                                    <div>
                                        <h3 className="text-2xl font-semibold">Natural Flow</h3>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Conversations that feel like real consultation.
                                        </p>
                                    </div>
                                </div>

                                {/* CARD 2 */}
                                <div className="rounded-2xl p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-blue-500/80 to-indigo-600/80 border border-white/10 shadow-xl hover:scale-[1.03] transition duration-300">

                                    <h2 className="text-6xl font-bold">99%</h2>
                                    <p className="text-white/80 text-sm">
                                        Faster than traditional structural modeling.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}