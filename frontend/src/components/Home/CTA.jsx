import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
    return (
        <section className="px-6 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="app-panel-strong overflow-hidden rounded-[40px] p-6 sm:p-10 lg:p-14">
                    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div>
                            <span className="app-chip">
                                <Sparkles size={12} className="text-accent" />
                                Ready when you are
                            </span>
                            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-tight text-text sm:text-5xl lg:text-6xl">
                                Start with a workspace that already feels organized.
                            </h2>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                                The new interface reduces visual noise, keeps the primary actions close, and makes
                                every screen read as one system instead of a stack of disconnected panels.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="app-panel rounded-[28px] p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                    Best for
                                </p>
                                <p className="mt-3 text-lg font-bold tracking-tight text-text">
                                    Long AI sessions, dashboard review, and settings changes without friction.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link to="/login" className="app-button-primary flex-1">
                                    Open workspace
                                    <ArrowRight size={14} />
                                </Link>
                                <a href="#features" className="app-button-secondary flex-1">
                                    Review design
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
