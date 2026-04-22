import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../utils/apiError";

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
            const res = await loginApi({
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            sessionStorage.setItem(
                "dashboard_welcome",
                JSON.stringify({
                    name: res.data.user?.name || email,
                    message: "Your command center is live. Everything is synced for this session."
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
        <div className="relative bg-[#0e0e0e] text-white min-h-screen flex flex-col overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full"></div>

            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-10 h-20 bg-black/20 backdrop-blur-xl border-b border-white/5">
                <Link to="/" className="text-xl font-black tracking-tighter text-white uppercase italic">
                    Architect<span className="text-blue-500">.AI</span>
                </Link>

                <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Verifying Identity</span>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-20">
                <div className="w-full max-w-[1440px] grid md:grid-cols-2 min-h-[820px] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                    <div className="hidden md:flex relative items-center justify-center p-12 bg-[#111]">
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                            alt="Abstract architectural landscape"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                        />
                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-5xl font-bold mb-6">
                                Ethereal Digital Structures
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center px-6 md:px-20 py-12 bg-black/40 backdrop-blur-2xl">
                        <div className="w-full max-w-md">
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Please enter your details to sign in.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="architect@studio.ai"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="password"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Link to="/forgot-password" title="Forgot Password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 font-semibold"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>
                            </form>

                            <p className="text-center mt-10 text-sm text-gray-400">
                                New here?{" "}
                                <Link to="/register" className="text-blue-400 hover:underline">
                                    Request access
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
