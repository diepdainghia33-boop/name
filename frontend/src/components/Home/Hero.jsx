import { ArrowUpRight, CheckCircle2, Clock3, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const highlights = [
    { label: "Context memory", value: "Persistent", icon: Layers3 },
    { label: "System state", value: "Live", icon: ShieldCheck },
    { label: "Turnaround", value: "< 1 min", icon: Clock3 },
];

const statusRows = [
    { label: "Conversation", value: "Structured threads" },
    { label: "Sources", value: "Files + web + logs" },
    { label: "Controls", value: "Visible and quiet" },
    { label: "Output", value: "Readable by default" },
];

export default function Hero() {
    const prefersReducedMotion = useReducedMotion();

    const panelTransition = prefersReducedMotion
        ? { duration: 0.01 }
        : { duration: 0.75, ease: [0.16, 1, 0.3, 1] };

    const floatTransition = prefersReducedMotion
        ? { duration: 0.01 }
        : { duration: 6.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" };

    return (
        <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pt-32 lg:pt-36">
            <div className="pointer-events-none absolute inset-0 app-shell" />

            <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={panelTransition}
                >
                    <span className="app-chip">
                        <Sparkles size={12} className="text-accent" />
                        Dark editorial workspace
                    </span>

                    <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-tight text-text sm:text-6xl lg:text-[5.6rem]">
                        A calmer command center for AI work.
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                        Chat, analytics, and system controls live in one place with a grounded dark palette,
                        clear hierarchy, and one restrained accent that keeps attention where it matters.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/login" className="app-button-primary">
                            Open workspace
                            <ArrowUpRight size={15} />
                        </Link>
                        <a href="#features" className="app-button-secondary">
                            See the layout
                        </a>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                        {highlights.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="app-panel rounded-[24px] p-4">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                        {label}
                                    </span>
                                    <Icon size={16} className="text-accent" />
                                </div>
                                <p className="text-xl font-black tracking-tight text-text">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    <div className="app-panel-strong relative min-h-[520px] overflow-hidden rounded-[36px] p-6 sm:p-8">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_oklch,var(--color-accent)_14%,transparent)_0%,transparent_28%),radial-gradient(circle_at_82%_16%,color-mix(in_oklch,var(--color-success)_10%,transparent)_0%,transparent_24%),linear-gradient(180deg,transparent,rgba(0,0,0,0.18))] opacity-80" />

                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl"
                            animate={prefersReducedMotion ? { opacity: 0.7 } : { x: [0, 18, 0], y: [0, 10, 0], scale: [1, 1.08, 1] }}
                            transition={floatTransition}
                        />
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-10 bottom-6 h-36 w-36 rounded-full bg-success/10 blur-3xl"
                            animate={prefersReducedMotion ? { opacity: 0.6 } : { x: [0, -14, 0], y: [0, -8, 0], scale: [1, 1.05, 1] }}
                            transition={floatTransition}
                        />

                        {!prefersReducedMotion && (
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
                                animate={{ y: [0, 460, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                        )}

                        <div className="relative grid h-full gap-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted">
                                        Session overview
                                    </p>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-text">
                                        Calm, visible, controlled.
                                    </h2>
                                </div>
                                <span className="app-chip border-success/30 text-success">
                                    <CheckCircle2 size={12} />
                                    Synced
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                                <motion.div
                                    className="app-panel relative overflow-hidden rounded-[30px] p-5"
                                    animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                                    transition={floatTransition}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                                Live thread
                                            </p>
                                            <p className="mt-2 text-lg font-black tracking-tight text-text">
                                                Ready for a new session.
                                            </p>
                                        </div>
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                                            <Sparkles size={16} />
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        <div className="rounded-[22px] border border-border/70 bg-surface px-4 py-3">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                                <span className="h-2 w-2 rounded-full bg-success" />
                                                Routing
                                            </div>
                                            <p className="mt-3 text-sm leading-7 text-text-muted">
                                                Conversation context is staged before the next reply is sent.
                                            </p>
                                        </div>

                                        <div className="rounded-[22px] border border-border/70 bg-surface/80 px-4 py-3">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                                <span className="h-2 w-2 rounded-full bg-accent" />
                                                Response
                                            </div>
                                            <p className="mt-3 text-sm leading-7 text-text-muted">
                                                Clear output, quieter transitions, and a stable control surface.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="grid gap-4">
                                    {statusRows.map((row, index) => (
                                        <motion.div
                                            key={row.label}
                                            className="app-panel rounded-[26px] p-5"
                                            style={{ minHeight: index === 0 ? 140 : 128 }}
                                            animate={
                                                prefersReducedMotion
                                                    ? {}
                                                    : { y: [0, index % 2 === 0 ? -4 : 4, 0] }
                                            }
                                            transition={{
                                                ...floatTransition,
                                                delay: index * 0.2,
                                            }}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                                {row.label}
                                            </p>
                                            <p className="mt-4 text-lg font-bold leading-7 text-text">
                                                {row.value}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="app-panel-muted rounded-[28px] p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                            Design note
                                        </p>
                                        <p className="mt-2 max-w-md text-sm leading-7 text-text-muted">
                                            The interface avoids loud glow and keeps every primary action within a clear, low-noise frame.
                                        </p>
                                    </div>
                                    <motion.div
                                        className="hidden h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent sm:flex"
                                        animate={prefersReducedMotion ? {} : { rotate: [0, 8, 0, -8, 0], scale: [1, 1.04, 1] }}
                                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Sparkles size={22} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
