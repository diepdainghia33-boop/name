import { useState, useEffect } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SettingsHeader from "../components/Dashboard/SettingsHeader";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ApiKeyManager from "../components/Dashboard/ApiKeyManager";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

export default function ArchitectSettings() {
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // UI State for controls
    const [toggles, setToggles] = useState({
        biometric: true,
        apiAccess: false
    });
    const [sliders, setSliders] = useState({
        creativity: 82,
        detail: 90,
        speed: 95
    });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [editingField, setEditingField] = useState(null);
     const [editingPassword, setEditingPassword] = useState(false);
     const [tempFormData, setTempFormData] = useState(formData);
     const [tempPasswordData, setTempPasswordData] = useState(passwordData);
     const [showApiKeyManager, setShowApiKeyManager] = useState(false);

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
            setTempFormData({
                name: parsedUser.name,
                email: parsedUser.email
            });
        }
    }, []);

    const handleEditClick = (field) => {
        setEditingField(field);
        setTempFormData({ ...formData });
    };

    const handleSaveEdit = () => {
        setFormData({ ...tempFormData });
        setEditingField(null);
    };

    const handleCancelEdit = () => {
        setTempFormData({ ...formData });
        setEditingField(null);
    };

    const handlePasswordEditToggle = () => {
        if (editingPassword) {
            setEditingPassword(false);
            setTempPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            setEditingPassword(true);
        }
    };

    const handlePasswordChange = (field, value) => {
        setTempPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordSave = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (tempPasswordData.newPassword !== tempPasswordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            setLoading(false);
            return;
        }

        if (tempPasswordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters." });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://127.0.0.1:8000/api/update-password", {
                current_password: tempPasswordData.currentPassword,
                new_password: tempPasswordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: "success", text: "Password updated successfully." });
            setEditingPassword(false);
            setTempPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to update password."
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordCancel = () => {
        setEditingPassword(false);
        setTempPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSliderChange = (key, value) => {
        setSliders(prev => ({ ...prev, [key]: value }));
    };

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

            setMessage({ type: "success", text: "Profile updated successfully." });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Update failed."
            });
        } finally {
            setLoading(false);
        }
    };

    const MaterialIcon = ({ name, className = "" }) => (
        <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );

    // Glow variants for cards
    const getGlowColor = (index) => {
        const colors = ["rgba(133, 173, 255, 0.15)", "rgba(251, 171, 255, 0.15)", "rgba(128, 151, 255, 0.15)"];
        return colors[index % colors.length];
    };

    return (
        <div className="flex min-h-screen overflow-hidden bg-[#0e0e0e] text-white">
            {/* SideNavBar */}
            <SidebarLeft user={user} />

            {/* Main Content Area */}
            <main className="ml-72 flex-1 flex h-screen bg-black/80 backdrop-blur-xl overflow-hidden">
                {/* Settings Canvas */}
                <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-[#0e0e0e]">
                    {/* Top Bar */}
                    <div className="px-8 bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
                        <SettingsHeader
                            toggleSidebar={() => { }}  // No-op since sidebar is hidden in Settings
                            rightOpen={false}
                            user={user}
                        />
                    </div>

                    <div className="p-8 max-w-6xl mx-auto w-full">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <h1 className="font-['Inter'] text-5xl font-extrabold tracking-tighter mb-4">
                                System<span className="text-[#85adff]"> Configuration</span>
                            </h1>
                            <p className="text-[#adaaaa] max-w-2xl font-['Inter'] leading-relaxed">
                                Manage your account identity, AI engine parameters, and security protocols.
                            </p>
                        </motion.div>

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

                        {/* Main Content Grid */}
                        <div className="space-y-8">
                            {/* Account Identity Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="person_outline" className="text-[#85adff]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#85adff]">
                                        Account Identity
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onHoverStart={() => setHoveredCard("name")}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col gap-4 group hover:bg-black/40 transition-all relative overflow-hidden"
                                        style={hoveredCard === "name" ? { boxShadow: `0 0 30px ${getGlowColor(0)}` } : {}}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-[#85adff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                            animate={{ x: hoveredCard === "name" ? [0, 100] : 0 }}
                                        />
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    whileHover={{ rotate: 5 }}
                                                    className="w-12 h-12 rounded-lg overflow-hidden bg-black/20"
                                                >
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${formData.name || "Architect"}&background=0D8ABC&color=fff&size=256`}
                                                        alt="Architect Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-['Space_Grotesk'] text-[#adaaaa] mb-1">Display Name</p>
                                                    {editingField === "name" ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={tempFormData.name}
                                                                onChange={(e) => setTempFormData(prev => ({ ...prev, name: e.target.value }))}
                                                                className="bg-black/40 border border-[#85adff]/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#85adff]/60 w-32"
                                                                autoFocus
                                                            />
                                                            <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300">
                                                                <MaterialIcon name="check" />
                                                            </button>
                                                            <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300">
                                                                <MaterialIcon name="close" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="font-bold text-lg">{formData.name || "Architect"}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => editingField === "name" ? handleSaveEdit() : handleEditClick("name")}
                                                className="material-symbols-outlined text-gray-500 hover:text-white transition-colors relative z-10"
                                            >
                                                {editingField === "name" ? "check" : "edit"}
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Email Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onHoverStart={() => setHoveredCard("email")}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col gap-4 group hover:bg-black/40 transition-all relative overflow-hidden"
                                        style={hoveredCard === "email" ? { boxShadow: `0 0 30px ${getGlowColor(0)}` } : {}}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-[#85adff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#85adff]/20 flex items-center justify-center">
                                                    <MaterialIcon name="mail" className="text-[#85adff]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-['Space_Grotesk'] text-[#adaaaa] mb-1">Registry Email</p>
                                                    {editingField === "email" ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="email"
                                                                value={tempFormData.email}
                                                                onChange={(e) => setTempFormData(prev => ({ ...prev, email: e.target.value }))}
                                                                className="bg-black/40 border border-[#85adff]/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#85adff]/60 w-32"
                                                                autoFocus
                                                            />
                                                            <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300">
                                                                <MaterialIcon name="check" />
                                                            </button>
                                                            <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300">
                                                                <MaterialIcon name="close" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="font-bold text-lg">{formData.email || "architect@ai.com"}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => editingField === "email" ? handleSaveEdit() : handleEditClick("email")}
                                                className="material-symbols-outlined text-gray-500 hover:text-white transition-colors relative z-10"
                                            >
                                                {editingField === "email" ? "check" : "verified_user"}
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Password Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onHoverStart={() => setHoveredCard("password")}
                                        onHoverEnd={() => setHoveredCard(null)}
                                        className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col gap-4 group hover:bg-black/40 transition-all relative overflow-hidden"
                                        style={hoveredCard === "password" ? { boxShadow: `0 0 30px ${getGlowColor(0)}` } : {}}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-[#85adff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                            animate={{ x: hoveredCard === "password" ? [0, 100] : 0 }}
                                        />
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#85adff]/20 flex items-center justify-center">
                                                    <MaterialIcon name="lock" className="text-[#85adff]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-['Space_Grotesk'] text-[#adaaaa] mb-1">Account Password</p>
                                                    {editingPassword ? (
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                type="password"
                                                                placeholder="Current password"
                                                                value={tempPasswordData.currentPassword}
                                                                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                                                className="bg-black/40 border border-[#85adff]/30 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#85adff]/60 w-40"
                                                                autoFocus
                                                            />
                                                            <input
                                                                type="password"
                                                                placeholder="New password"
                                                                value={tempPasswordData.newPassword}
                                                                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                                                className="bg-black/40 border border-[#85adff]/30 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#85adff]/60 w-40"
                                                            />
                                                            <input
                                                                type="password"
                                                                placeholder="Confirm new password"
                                                                value={tempPasswordData.confirmPassword}
                                                                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                                                className="bg-black/40 border border-[#85adff]/30 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#85adff]/60 w-40"
                                                            />
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <button onClick={handlePasswordSave} disabled={loading} className="text-green-400 hover:text-green-300 disabled:opacity-50">
                                                                    <MaterialIcon name="check" />
                                                                </button>
                                                                <button onClick={handlePasswordCancel} className="text-red-400 hover:text-red-300">
                                                                    <MaterialIcon name="close" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="font-bold text-lg">••••••••</p>
                                                    )}
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={editingPassword ? handlePasswordCancel : handlePasswordEditToggle}
                                                className="material-symbols-outlined text-gray-500 hover:text-white transition-colors relative z-10"
                                            >
                                                {editingPassword ? "close" : "lock"}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            {/* Generative Engine Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="memory" className="text-[#fbabff]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#fbabff]">
                                        Generative Engine
                                    </h2>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-black/20 rounded-xl border border-white/5 p-8 space-y-8"
                                >
                                    {/* Inference Precision */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="max-w-sm">
                                            <h4 className="font-bold text-lg mb-2">Inference Precision</h4>
                                            <p className="text-sm text-[#adaaaa] leading-relaxed">
                                                Higher precision increases generation time but ensures structural integrity.
                                            </p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center gap-4 bg-black/40 p-2 rounded-full px-6 cursor-pointer border border-white/10"
                                        >
                                            <span className="text-[10px] font-['Space_Grotesk'] font-bold text-[#adaaaa]">STANDARD</span>
                                            <div className="w-24 h-1.5 bg-black/20 rounded-full relative">
                                                <motion.div
                                                    animate={{ width: `${sliders.creativity}%` }}
                                                    transition={springTransition}
                                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#85adff] to-[#fbabff] rounded-full shadow-[0_0_10px_rgba(251,171,255,0.4)]"
                                                />
                                            </div>
                                            <span className="text-[10px] font-['Space_Grotesk'] font-bold text-[#fbabff]">ULTRA</span>
                                        </motion.div>
                                    </div>

                                    {/* Sliders Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Creativity Bias */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="space-y-3 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-['Space_Grotesk'] uppercase text-[#adaaaa]">Creativity</label>
                                                <motion.span
                                                    key={sliders.creativity}
                                                    initial={{ scale: 1.2 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-[10px] font-['Space_Grotesk'] text-[#85adff] font-bold"
                                                >
                                                    {sliders.creativity}%
                                                </motion.span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#85adff]"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={sliders.creativity}
                                                    onChange={(e) => handleSliderChange("creativity", parseInt(e.target.value))}
                                                />
                                                <motion.div
                                                    className="absolute top-0 left-0 h-1.5 bg-[#85adff] rounded-lg pointer-events-none"
                                                    style={{ width: `${sliders.creativity}%` }}
                                                    transition={springTransition}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[8px] text-[#adaaaa]">
                                                <span>Safe</span>
                                                <span>Bold</span>
                                            </div>
                                        </motion.div>

                                        {/* Detail Density */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="space-y-3 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-['Space_Grotesk'] uppercase text-[#adaaaa]">Detail Density</label>
                                                <motion.span
                                                    key={sliders.detail}
                                                    initial={{ scale: 1.2 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-[10px] font-['Space_Grotesk'] text-[#fbabff] font-bold"
                                                >
                                                    {sliders.detail > 66 ? "HIGH" : sliders.detail > 33 ? "MED" : "LOW"}
                                                </motion.span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#fbabff]"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={sliders.detail}
                                                    onChange={(e) => handleSliderChange("detail", parseInt(e.target.value))}
                                                />
                                                <motion.div
                                                    className="absolute top-0 left-0 h-1.5 bg-[#fbabff] rounded-lg pointer-events-none"
                                                    style={{ width: `${sliders.detail}%` }}
                                                    transition={springTransition}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[8px] text-[#adaaaa]">
                                                <span>Sketch</span>
                                                <span>Full</span>
                                            </div>
                                        </motion.div>

                                        {/* Optimization Speed */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className="space-y-3 p-4 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-['Space_Grotesk'] uppercase text-[#adaaaa]">Speed</label>
                                                <motion.span
                                                    key={sliders.speed}
                                                    initial={{ scale: 1.2 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-[10px] font-['Space_Grotesk'] text-[#85adff] font-bold"
                                                >
                                                    {sliders.speed > 80 ? "TURBO" : sliders.speed > 50 ? "FAST" : "STD"}
                                                </motion.span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#85adff]"
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={sliders.speed}
                                                    onChange={(e) => handleSliderChange("speed", parseInt(e.target.value))}
                                                />
                                                <motion.div
                                                    className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[#85adff] to-[#fbabff] rounded-lg pointer-events-none"
                                                    style={{ width: `${sliders.speed}%` }}
                                                    transition={springTransition}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[8px] text-[#adaaaa]">
                                                <span>Quality</span>
                                                <span>Speed</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </section>

                            {/* Security & Vault Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="shield" className="text-[#8097ff]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#8097ff]">
                                        Security & Vault
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Biometric Vault */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#8097ff]/20 flex items-center justify-center">
                                                <MaterialIcon name="fingerprint" className="text-[#8097ff]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Biometric Vault</p>
                                                <p className="text-xs text-[#adaaaa]">Encrypted session authentication</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.biometric ? 'bg-[#8097ff]/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('biometric')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.biometric ? 20 : 0 }}
                                                className="w-4 h-4 bg-[#8097ff] rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* API Key Access */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setShowApiKeyManager(true)}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#85adff]/20 flex items-center justify-center">
                                                <MaterialIcon name="key" className="text-[#85adff]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">API Key Access</p>
                                                <p className="text-xs text-[#adaaaa]">Manage integration tokens</p>
                                            </div>
                                        </div>
                                        <MaterialIcon name="chevron_right" className="text-gray-500" />
                                    </motion.div>
                                </div>
                            </section>
                        </div> {/* Close main content grid */}
                    </div> {/* Close content wrapper (p-8) */}

                    {/* API Key Manager Modal - positioned inside canvas */}
                    <ApiKeyManager
                        isOpen={showApiKeyManager}
                        onClose={() => setShowApiKeyManager(false)}
                    />
                </div> {/* Close settings canvas (flex-1) */}
            </main>
        </div>
    );
}