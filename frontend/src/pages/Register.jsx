import { useEffect, useRef, useState } from "react";
import { registerApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../utils/apiError";

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
            const res = await registerApi({
                name,
                email,
                password
            });

            setSuccessMessage(res.data.message || "Đăng ký thành công. Vui lòng đăng nhập.");
            redirectTimerRef.current = window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 5000);
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Lỗi đăng ký. Vui lòng kiểm tra lại thông tin.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-[#0e0e0e] text-white min-h-screen flex flex-col overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full"></div>

            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="text-lg font-semibold tracking-wide text-blue-400">
                    Architect AI
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-20">
                <div className="w-full max-w-[1440px] grid md:grid-cols-2 min-h-[820px] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                    <div className="hidden md:flex relative items-center justify-center p-12 bg-[#111]">
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                            alt="background"
                        />
                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-5xl font-bold mb-6">
                                Join The <br /> Neural Network
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Đăng ký tài khoản để truy cập vào hệ thống lõi.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center px-6 md:px-20 py-12 bg-black/40 backdrop-blur-2xl">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold mb-2">
                                    Create Account
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Hãy nhập thông tin để đăng ký tham gia.
                                </p>
                            </div>

                            <form className="space-y-5" onSubmit={handleRegister}>
                                <div>
                                    <label className="text-xs text-gray-400 uppercase">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Tên của bạn"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="ai@architect.com"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        required
                                        minLength={6}
                                        placeholder="••••••••"
                                        className="w-full h-12 mt-2 px-4 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                {successMessage && (
                                    <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse transition-all"></div>
                                        {successMessage}
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-semibold mt-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    {loading ? "Đang xử lý..." : "Sign Up"}
                                </button>
                            </form>

                            <p className="text-center mt-8 text-sm text-gray-400">
                                Sudah punya tài khoản?{" "}
                                <Link to="/login" className="text-blue-400 hover:underline">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
