export default function Process() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 bg-black text-white overflow-hidden">

            {/* ===== BACKGROUND ===== */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-500/10 blur-[220px] rounded-full"></div>

            {/* ===== CONTAINER ===== */}
            <div className="relative z-10 w-full max-w-6xl mx-auto">

                <div className="grid md:grid-cols-2 gap-20 items-center">

                    {/* ===== LEFT IMAGE ===== */}
                    <div className="relative group">

                        {/* glow border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-2xl opacity-70 group-hover:opacity-100 transition duration-500"></div>

                        <div className="relative overflow-hidden rounded-2xl h-[420px] md:h-[500px] border border-white/10">

                            <img
                                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
                                alt="process visualization"
                                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            {/* overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        </div>
                    </div>

                    {/* ===== RIGHT CONTENT ===== */}
                    <div className="flex flex-col justify-center">

                        {/* TITLE */}
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-12">
                            Simplicity <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                by Design
                            </span>
                        </h2>

                        {/* ===== TIMELINE ===== */}
                        <div className="relative space-y-12">

                            {/* line */}
                            <div className="absolute left-[10px] top-2 bottom-2 w-[2px] bg-white/10"></div>

                            {[
                                {
                                    step: "01",
                                    title: "Initialize Canvas",
                                    desc: "Start with a blank workspace.",
                                },
                                {
                                    step: "02",
                                    title: "Collaborative Prompting",
                                    desc: "Work with AI to refine ideas.",
                                },
                                {
                                    step: "03",
                                    title: "Export & Integrate",
                                    desc: "Download or integrate via API.",
                                },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-6 group relative">

                                    {/* dot */}
                                    <div className="relative z-10 mt-1">
                                        <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition"></div>
                                        </div>
                                    </div>

                                    {/* content */}
                                    <div>
                                        <span className="text-gray-500 text-sm font-mono">
                                            {item.step}
                                        </span>

                                        <h4 className="font-semibold text-lg mt-1 group-hover:text-blue-400 transition">
                                            {item.title}
                                        </h4>

                                        <p className="text-gray-400 text-sm mt-1 leading-relaxed max-w-md">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}