export default function CTA() {
    return (
        <section className="px-6 md:px-16 py-32 bg-black text-white">

            <div className="relative max-w-6xl mx-auto rounded-[48px] overflow-hidden border border-white/10">

                {/* BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#1a1a1a]"></div>

                {/* glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.3),transparent_40%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.3),transparent_40%)]"></div>

                {/* CONTENT */}
                <div className="relative z-10 text-center px-8 py-24 md:py-32">

                    {/* TITLE */}
                    <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                        Start building <br />
                        <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                            with intelligence.
                        </span>
                    </h2>

                    {/* DESC */}
                    <p className="mt-8 text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed">
                        Join 50,000+ architects and designers shaping the next
                        generation of space and software.
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">

                        {/* PRIMARY */}
                        <button className="px-10 py-5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-lg font-medium shadow-xl shadow-blue-500/30 transition duration-300 hover:scale-105">
                            Try it Now
                        </button>

                        {/* SECONDARY */}
                        <button className="px-10 py-5 rounded-full border border-white/20 text-white text-lg hover:bg-white/10 transition duration-300">
                            Book a Demo
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}