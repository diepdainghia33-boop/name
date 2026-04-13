import React, { useState, useEffect } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SidebarRight from "../components/Dashboard/SidebarRight";
import Header from "../components/Dashboard/Header";
import { User, Zap, Shield, Mail, Save, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ArchitectSettings() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [saved, setSaved] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        current_password: "",
        new_password: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData(prev => ({
                ...prev,
                name: parsedUser.name,
                email: parsedUser.email
            }));
        }
    }, []);

    const handleProfileUpdate = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://127.0.0.1:8000/api/update-profile", {
                name: formData.name,
                email: formData.email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setSaved(true);
            setMessage({ type: "success", text: "Matrix Link Deciphered & Synced." });
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Protocol interference detected. Update failed."
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://127.0.0.1:8000/api/update-password", {
                current_password: formData.current_password,
                new_password: formData.new_password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFormData(prev => ({ ...prev, current_password: "", new_password: "" }));
            setMessage({ type: "success", text: "Security keys rotated successfully." });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Security override failed."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden">
            <SidebarLeft user={user} />

            <main className={`ml-64 ${showRightSidebar ? "mr-80" : "mr-0"} flex-1 px-8 py-10 overflow-y-auto transition-all duration-300`}>
                <div className="max-w-6xl mx-auto">

                    <Header
                        tab={activeTab}
                        setTab={setActiveTab}
                        toggleSidebar={() => setShowRightSidebar(!showRightSidebar)}
                        rightOpen={showRightSidebar}
                    />

                    {/* HERO SECTION */}
                    <section className="mb-16 mt-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-7xl font-bold leading-tight mb-4"
                        >
                            Configure AI <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">System</span> Protocols
                        </motion.h1>
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            Fine-tune your architectural engine, manage security credentials, and optimize your neural processing workspace.
                        </p>
                    </section>

                    {/* Feedback Message */}
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`mb-8 p-4 rounded-2xl text-sm font-bold border ${message.type === "success"
                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content Section */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "overview" && (
                                <div className="space-y-10 pb-20">
                                    <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -z-10" />

                                        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                                            <div className="relative group/avatar">
                                                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 p-1 bg-white/5 group-hover/avatar:border-blue-500/50 transition-all duration-500">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${user?.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                                                        alt="Avatar"
                                                        className="w-full h-full rounded-[2.2rem] object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-2">Identity Token</label>
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] ml-2">Registry Mail</label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                                            <input
                                                                type="email"
                                                                value={formData.email}
                                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-14 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    disabled={loading}
                                                    onClick={handleProfileUpdate}
                                                    className={`px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${saved
                                                            ? "bg-green-600/20 text-green-500 border border-green-500/30"
                                                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 border border-blue-400/20"
                                                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                                >
                                                    {loading ? "Decrypting..." : saved ? "Synced Success" : "Save Configurations"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-8 pb-20">
                                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-md">
                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                            <Shield className="text-blue-500" size={24} /> Security Protocols
                                        </h3>
                                        <div className="space-y-8 max-w-xl">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Master Access Key</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        value={formData.current_password}
                                                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                                        placeholder="Current Password"
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                                    />
                                                    <button
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                                    >
                                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">New Neural Signature</label>
                                                <input
                                                    type="password"
                                                    value={formData.new_password}
                                                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                                    placeholder="New Password"
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                                />
                                            </div>
                                            <button
                                                disabled={loading}
                                                onClick={handlePasswordUpdate}
                                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                {loading ? "Updating..." : "Rotate Security Keys"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "engine" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                            <Zap className="text-blue-500" size={24} /> Neural Precision
                                        </h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: "Matrix Density", val: 82 },
                                                { label: "Context Window", val: 95 },
                                                { label: "Rendering Speed", val: 75 },
                                            ].map(s => (
                                                <div key={s.label}>
                                                    <div className="flex justify-between text-[11px] font-bold mb-2 uppercase text-gray-400">
                                                        <span>{s.label}</span>
                                                        <span>{s.val}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${s.val}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {showRightSidebar && (
                <SidebarRight
                    user={user}
                    logs={[
                        `${new Date().toLocaleTimeString()} - Identity Link Synchronized`,
                        `${new Date().toLocaleTimeString()} - Security layer active`
                    ]}
                    addLog={() => { }}
                />
            )}
        </div>
    );
}
