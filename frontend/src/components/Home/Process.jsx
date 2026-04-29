import { ArrowRight, FileText, Globe, Layers3, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        step: "01",
        title: "Open the workspace",
        desc: "Users land in a calm shell with navigation, recent context, and the current session in view.",
        icon: Layers3,
    },
    {
        step: "02",
        title: "Work with context",
        desc: "Chat, attach files, search the web, or inspect data without switching into separate tools.",
        icon: Search,
    },
    {
        step: "03",
        title: "Keep control",
        desc: "Settings, privacy, and output preferences remain visible so the system feels predictable.",
        icon: ShieldCheck,
    },
];

export default function Process() {
    return (
        <section id="process" className="relative overflow-hidden px-6 py-20 sm:px-8 lg:py-28">
            <div className="absolute inset-0 bg-background" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[32rem] -translate-y-1/2 bg-accent/8 blur-[120px]" />

            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="app-panel-strong rounded-[36px] p-6 sm:p-8 lg:p-10"
                >
                    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Workflow
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight text-text sm:text-4xl">
                                Three steps. No clutter.
                            </h2>
                        </div>
                        <div className="hidden rounded-full border border-accent/20 bg-accent/10 p-3 text-accent sm:flex">
                            <FileText size={18} />
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        {steps.map(({ step, title, desc, icon: Icon }) => (
                            <div key={step} className="app-panel rounded-[28px] p-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface text-accent">
                                        <Icon size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                                {step}
                                            </span>
                                            <span className="h-px flex-1 bg-border/70" />
                                        </div>
                                        <h3 className="mt-3 text-lg font-bold tracking-tight text-text">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-7 text-text-muted">
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="grid gap-6"
                >
                    <div className="app-panel rounded-[36px] p-6 sm:p-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                            What changes
                        </p>
                        <h3 className="mt-3 text-2xl font-black tracking-tight text-text">
                            More structure, less spectacle.
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-8 text-text-muted">
                            The redesign removes the loud purple-blue glow language and replaces it with quieter surfaces,
                            better spacing, and one warm accent that is easier to scan over long sessions.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {[
                                "Fewer repeated card patterns",
                                "Clearer active state treatment",
                                "More usable form controls",
                                "Responsive layouts that keep primary actions visible",
                            ].map((item) => (
                                <div key={item} className="rounded-[20px] border border-border/70 bg-surface px-4 py-3 text-sm text-text-muted">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="app-panel-muted rounded-[36px] p-6 sm:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                    Primary promise
                                </p>
                                <h3 className="mt-2 text-xl font-black tracking-tight text-text">
                                    Fast to use. Easy to trust.
                                </h3>
                            </div>
                            <Globe size={22} className="text-accent" />
                        </div>
                        <p className="mt-4 text-sm leading-7 text-text-muted">
                            We keep the AI surface readable and the operational controls visible, so the app feels like a tool,
                            not a demo reel.
                        </p>
                        <a href="/chat" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.24em] text-accent transition-colors hover:text-accent-strong">
                            Open the chat
                            <ArrowRight size={14} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
