import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="relative bg-[#0e0e0e] text-white min-h-screen flex flex-col overflow-hidden">
            {/* BACKGROUND GLOWS */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[180px] rounded-full"></div>

            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
                <Link to="/" className="text-lg font-black tracking-tighter text-white uppercase italic">
                    Architect<span className="text-blue-500">.AI</span>
                </Link>
            </header>

            <main className="flex-grow flex items-center justify-center pt-20 px-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[32px] p-10 backdrop-blur-3xl shadow-2xl"
                >
                    <Link to="/login" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8 transition-colors">
                        <ChevronLeft size={14} /> Back to neural login
                    </Link>

                    {!submitted ? (
                        <>
                            <div className="mb-10">
                                <h1 className="text-3xl font-black mb-3">Recover Protocol</h1>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Enter your registered mail to receive a decryption link for your system access.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] ml-1">Registry Mail</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="architect@studio.ai"
                                            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? "Decrypting..." : (
                                        <>
                                            Request Link <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <Send size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-4">Transmission Sent</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-10">
                                If an account exists for <span className="text-white font-bold">{email}</span>, you will receive instructions shortly.
                            </p>
                            <Link to="/login" className="block w-full h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Return to Console
                            </Link>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}