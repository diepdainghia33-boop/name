import { Brain, FileSearch, Layers3, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Sparkles,
        eyebrow: "Memory",
        title: "Context that persists.",
        desc: "The workspace keeps your history, tone, and recurring work close at hand so long sessions stay coherent.",
    },
    {
        icon: Workflow,
        eyebrow: "Flow",
        title: "One path from prompt to output.",
        desc: "Chat, files, web search, and logs all sit in the same frame so users do not need to hunt across screens.",
    },
    {
        icon: ShieldCheck,
        eyebrow: "Control",
        title: "Private by default.",
        desc: "Security, notifications, and preferences stay visible without forcing users into modal-heavy journeys.",
    },
    {
        icon: FileSearch,
        eyebrow: "Sources",
        title: "Files and web in one conversation.",
        desc: "The app handles research, attachments, and conversation history as one continuous flow of work.",
    },
];

export default function Features() {
    return (
        <section id="features" className="relative overflow-hidden px-6 py-20 sm:px-8 lg:py-24">
            <div className="absolute inset-0 bg-background-elevated/80" />
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="app-chip">
                            <Layers3 size={12} className="text-accent" />
                            What the interface does
                        </span>
                        <h2 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-text sm:text-5xl lg:text-6xl">
                            Simpler to scan.
                            <span className="block text-accent">Harder to miss.</span>
                        </h2>
                        <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
                            The redesign removes the loud purple-blue glow language and replaces it with quieter surfaces,
                            better spacing, and one warm accent that is easier to scan over long sessions.
                        </p>
                    </div>

                    <a href="#process" className="app-button-secondary w-fit">
                        View the flow
                    </a>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="app-panel-strong rounded-[32px] p-6 sm:p-8"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                    Priority experience
                                </p>
                                <h3 className="mt-2 text-2xl font-black tracking-tight text-text">
                                    One workspace. Multiple jobs.
                                </h3>
                            </div>
                            <div className="hidden rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent sm:inline-flex">
                                Stable
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {features.map(({ icon: Icon, eyebrow, title, desc }) => (
                                <div key={title} className="app-panel rounded-[28px] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/15 bg-accent/10 text-accent">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                                {eyebrow}
                                            </p>
                                            <h4 className="mt-1 text-lg font-bold tracking-tight text-text">
                                                {title}
                                            </h4>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-text-muted">
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className="app-panel rounded-[32px] p-6"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Interaction rules
                            </p>
                            <ul className="mt-5 space-y-4 text-sm leading-7 text-text-muted">
                                <li className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                                    Keep primary actions visible and predictable.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-success" />
                                    Use motion only for state change, not decoration.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-warning" />
                                    Let empty states teach the next step.
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="app-panel-muted rounded-[32px] p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                        Built for
                                    </p>
                                    <h3 className="mt-2 text-xl font-black tracking-tight text-text">
                                        Longer work sessions.
                                    </h3>
                                </div>
                                <Brain size={24} className="text-accent" />
                            </div>
                            <p className="mt-4 text-sm leading-7 text-text-muted">
                                The visual system is tuned for focus: low glare, strong contrast, and a layout that scales from
                                laptop to mobile without collapsing into a generic card grid.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
