import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../utils/apiError";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
    "Keep conversations, analytics, and settings in one place.",
    "Use a workspace that stays readable during long sessions.",
    "Get a calmer dark interface without heavy neon glow.",
];

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await loginApi({ email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            sessionStorage.setItem(
                "dashboard_welcome",
                JSON.stringify({
                    name: res.data.user?.name || email,
                    message: "Your command center is live. Everything is synced for this session.",
                })
            );

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Sai email hoặc mật khẩu"));
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
                                Secure sign in
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 sm:flex">
                        <ShieldCheck size={14} className="text-success" />
                        <span className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                            Encrypted session
                        </span>
                    </div>
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
                            <LockKeyhole size={12} className="text-accent" />
                            Private workspace
                        </span>
                        <h1 className="mt-6 max-w-xl text-4xl font-black leading-[0.95] tracking-tight text-text sm:text-5xl">
                            Sign in to a quieter, more deliberate AI workspace.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-8 text-text-muted">
                            Access the chat, dashboard, analytics, and settings from one place. The new UI is built to feel
                            calm on first load and efficient after that.
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
                        Need access?{" "}
                        <Link to="/register" className="font-bold text-accent transition-colors hover:text-accent-strong">
                            Request an account
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
                            Welcome back
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-text">
                            Sign in
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted">
                            Use your email and password to enter the workspace.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
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
                                    placeholder="architect@studio.ai"
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
                                placeholder="••••••••"
                                className="app-input"
                            />
                            <div className="mt-2 flex justify-end">
                                <Link to="/forgot-password" className="text-xs font-bold text-accent transition-colors hover:text-accent-strong">
                                    Forgot password?
                                </Link>
                            </div>
                        </label>

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
                            {loading ? "Signing in..." : (
                                <>
                                    Enter workspace
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
