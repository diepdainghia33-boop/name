import { Sparkles, Compass, Shield, Zap, Brain, Layers } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "Contextual Memory",
        desc: "Our models remember your project's history, style preferences.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        gradient: "from-blue-500/20 to-cyan-500/10",
        border: "border-blue-500/20",
        text: "text-blue-400",
    },
    {
        icon: Compass,
        title: "Blueprint Generation",
        desc: "Turn ideas into structured technical layouts.",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
        gradient: "from-purple-500/20 to-violet-500/10",
        border: "border-purple-500/20",
        text: "text-purple-400",
    },
    {
        icon: Shield,
        title: "Private Workspace",
        desc: "Secure and private environment.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
        gradient: "from-pink-500/20 to-rose-500/10",
        border: "border-pink-500/20",
        text: "text-pink-400",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        desc: "Blazing fast AI responses.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        gradient: "from-amber-500/20 to-yellow-500/10",
        border: "border-amber-500/20",
        text: "text-amber-400",
    },
    {
        icon: Brain,
        title: "Deep Reasoning",
        desc: "Multi-step logical thinking.",
        image: "https://images.unsplash.com/photo-1581090700227-4c4c4a6bba5d",
        gradient: "from-emerald-500/20 to-teal-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
    },
    {
        icon: Layers,
        title: "Multi-Modal",
        desc: "Text, image, code unified.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        gradient: "from-indigo-500/20 to-blue-500/10",
        border: "border-indigo-500/20",
        text: "text-indigo-400",
    },
];

export default function Features() {
    return (
        <section className="relative pt-40 pb-32 px-6 md:px-12 bg-black text-white overflow-hidden">

            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black"></div>

            {/* Glow */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/10 blur-[220px] rounded-full"></div>

            <div className="relative z-10 max-w-[1400px] mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20 gap-10">

                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-xl">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                            <span className="text-xs uppercase tracking-widest text-gray-400">
                                The Process
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Simplicity <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                by Design
                            </span>
                        </h2>

                        <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                            Powerful capabilities, carefully designed to feel effortless.
                        </p>
                    </div>

                    {/* FIX WARNING: dùng button thay vì <a href="#"> */}
                    <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-300">
                        <span className="text-sm text-gray-300 group-hover:text-white">
                            Explore all features
                        </span>
                        <span className="text-blue-400 group-hover:translate-x-1 transition">
                            →
                        </span>
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        const isLarge = i === 0 || i === 3;

                        return (
                            <div
                                key={feat.title}
                                className={`group relative rounded-3xl overflow-hidden border border-white/[0.08] hover:-translate-y-2 transition-all duration-500 ${isLarge ? "lg:col-span-2" : ""}`}
                            >

                                {/* IMAGE */}
                                <img
                                    src={feat.image}
                                    alt={feat.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition duration-700"
                                />

                                {/* OVERLAY */}
                                <div className="absolute inset-0 bg-black/60"></div>

                                {/* GLOW */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br ${feat.gradient}`} />

                                {/* CONTENT */}
                                <div className="relative z-10 p-8 md:p-10">

                                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${feat.gradient} border ${feat.border}`}>
                                        <Icon className={`w-7 h-7 ${feat.text}`} />
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-3">
                                        {feat.title}
                                    </h3>

                                    <p className="text-gray-400 text-[15px] leading-relaxed">
                                        {feat.desc}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <span className={`text-sm ${feat.text}`}>
                                            Learn more
                                        </span>
                                        <span className={`${feat.text} group-hover:translate-x-1 transition`}>
                                            →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* STATS */}
                <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: "99.9%", label: "Uptime SLA" },
                        { value: "<50ms", label: "Avg Response" },
                        { value: "10M+", label: "Queries" },
                        { value: "256-bit", label: "Encryption" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition"
                        >
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500 mt-2 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}