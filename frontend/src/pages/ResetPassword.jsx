import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { resetPasswordApi } from "../api/auth.api";
import { getApiErrorMessage } from "../utils/apiError";

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const canSubmit = useMemo(() => {
        return Boolean(token && email && password && passwordConfirmation && password === passwordConfirmation);
    }, [token, email, password, passwordConfirmation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await resetPasswordApi({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setSuccess(true);
            setMessage(response.data?.message || "Password updated successfully.");
            window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1800);
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to reset password."));
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
                                Reset password
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
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                        <ShieldCheck size={14} className="text-success" />
                        Secure reset
                    </div>

                    <div className="mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-muted">
                            New password
                        </p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight text-text">
                            Create a new password
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                            Enter your email and the new password you want to use for this account.
                        </p>
                    </div>

                    {success ? (
                        <div className="mt-8 rounded-[24px] border border-success/30 bg-success/10 p-6 text-center">
                            <p className="text-sm font-bold text-success">
                                {message || "Password updated successfully."}
                            </p>
                            <Link to="/login" className="app-button-secondary mt-6">
                                Return to sign in
                            </Link>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                            <label className="block">
                                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="app-input"
                                    placeholder="architect@studio.ai"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                    New password
                                </span>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="app-input pl-11"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-muted">
                                    Confirm password
                                </span>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="app-input"
                                    placeholder="••••••••"
                                />
                            </label>

                            {!token && (
                                <div className="rounded-[20px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                                    Reset token is missing.
                                </div>
                            )}

                            {error && (
                                <div className="rounded-[20px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="rounded-[20px] border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !canSubmit}
                                className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Updating..." : "Update password"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
