import { useEffect, useRef, useState } from "react";
import { registerApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../utils/apiError";
import { ArrowRight, CircleCheckBig, Mail, Sparkles, UserRound } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
    "Access chat, dashboard, analytics, and settings in one account.",
    "Keep the UI consistent across desktop and mobile.",
    "Use the same palette, hierarchy, and spacing from the first login.",
];

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const redirectTimerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (redirectTimerRef.current) {
                window.clearTimeout(redirectTimerRef.current);
            }
        };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const res = await registerApi({ name, email, password });
            setSuccessMessage(res.data.message || "Registration complete. Redirecting to sign in.");
            redirectTimerRef.current = window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 4000);
        } catch (err) {
            setError(getApiErrorMessage(err, "Lỗi đăng ký. Vui lòng kiểm tra lại thông tin."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-background text-text">
            <div className="app-shell absolute inset-0" />
            <header className="relative z-10 border-b border-border/70 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-surface">
                            <Sparkles size={18} className="text-accent" />
                        </div>
                        <div className="leading-tight">
                            <div className="font-display text-lg font-black tracking-tight text-text">
                                Architect AI
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Request access
                            </p>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="app-panel-strong flex flex-col justify-between rounded-[36px] p-6 sm:p-8 lg:p-10"
                >
                    <div>
                        <span className="app-chip">
                            <UserRound size={12} className="text-accent" />
                            Create account
                        </span>
                        <h1 className="mt-6 max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-text sm:text-5xl">
                            Get access to the workspace in one clean flow.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-8 text-text-muted">
                            Create an account and step into the same calm layout used by chat, analytics, and settings.
                        </p>

                        <div className="mt-8 space-y-3">
                            {benefits.map((item) => (
                                <div key={item} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-surface px-4 py-3 text-sm leading-7 text-text-muted">
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-8 text-sm leading-7 text-text-muted">
                        Already have access?{" "}
                        <Link to="/login" className="font-bold text-accent transition-colors hover:text-accent-strong">
                            Sign in
                        </Link>
                    </p>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="app-panel-strong rounded-[36px] p-6 sm:p-8 lg:p-10"
                >
                    <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                            Request access
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-text">
                            Create your account
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted">
                            Enter your details to join the workspace.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <label className="block">
                            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                Full name
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your name"
                                className="app-input"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                Email
                            </span>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="ai@architect.com"
                                    className="app-input pl-11"
                                />
                            </div>
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                Password
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="app-input"
                            />
                        </label>

                        {successMessage && (
                            <div className="rounded-[20px] border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                                <CircleCheckBig size={16} className="mr-2 inline-block align-[-3px]" />
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-[20px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : (
                                <>
                                    Create account
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.section>
            </main>
        </div>
    );
}
