import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { forgotPasswordApi } from "../api/auth.api";
import { getApiErrorMessage } from "../utils/apiError";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await forgotPasswordApi({ email });
            setMessage(response.data?.message || "If the email exists, a reset link has been sent.");
            setSubmitted(true);
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to send reset link."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-background text-text">
            <div className="app-shell absolute inset-0" />
            <header className="relative z-10 border-b border-border/70 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center px-6 sm:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-surface">
                            <Sparkles size={18} className="text-accent" />
                        </div>
                        <div className="leading-tight">
                            <div className="font-display text-lg font-black tracking-tight text-text">
                                Architect AI
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                Recover access
                            </p>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center px-6 py-10 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="app-panel-strong w-full rounded-[36px] p-6 sm:p-8 lg:p-10"
                >
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-muted transition-colors hover:text-text"
                    >
                        <ChevronLeft size={14} />
                        Back to sign in
                    </Link>

                    {!submitted ? (
                        <>
                            <div className="mt-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                                    Password reset
                                </p>
                                <h1 className="mt-3 text-3xl font-black tracking-tight text-text">
                                    Recover access
                                </h1>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                                    Enter the email attached to your account and we will send a reset link.
                                </p>
                            </div>

                            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                <label className="block">
                                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                        Email
                                    </span>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="architect@studio.ai"
                                            className="app-input pl-11"
                                        />
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
                                    {loading ? "Sending..." : (
                                        <>
                                            Send reset link
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-10 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-success/30 bg-success/10 text-success">
                                <Send size={30} />
                            </div>
                            <h2 className="mt-6 text-2xl font-black tracking-tight text-text">
                                Reset link sent
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-muted">
                                If an account exists for <span className="font-bold text-text">{email}</span>, you will receive
                                a reset email shortly.
                            </p>
                            {message && (
                                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-success">
                                    {message}
                                </p>
                            )}
                            <Link to="/login" className="app-button-secondary mt-8">
                                Return to sign in
                            </Link>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
