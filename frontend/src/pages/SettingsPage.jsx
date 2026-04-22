import { useState, useEffect } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import SettingsHeader from "../components/Dashboard/SettingsHeader";
import { motion, AnimatePresence } from "framer-motion";
import { settingsApi } from "../api/settings.api";
import { updateProfileApi, updatePasswordApi } from "../api/auth.api";
import ApiKeyManager from "../components/Dashboard/ApiKeyManager";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

export default function ArchitectSettings() {
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // UI State for controls
    const [toggles, setToggles] = useState({
        biometric: true,
        apiAccess: false,
        darkMode: true,
        sendOnEnter: true,
        autoScroll: true,
        showTimestamps: true,
        desktopNotifications: false,
        emailNotifications: false
    });

    const [sliders, setSliders] = useState({
        creativity: 82,
        detail: 90,
        speed: 95,
        contextLength: 70
    });

    const [preferences, setPreferences] = useState({
        fontSize: 'medium',
        language: 'vi',
        model: 'gpt-4',
        theme: 'dark'
    });

    const [hoveredCard, setHoveredCard] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [editingPassword, setEditingPassword] = useState(false);
    const [tempFormData, setTempFormData] = useState(formData);
    const [tempPasswordData, setTempPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showApiKeyManager, setShowApiKeyManager] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (preferences.fontSize) {
            applyFontSize(preferences.fontSize);
        }
    }, [preferences.fontSize]);

    const applyFontSize = (size) => {
        const html = document.documentElement;
        html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
        html.classList.add(`font-size-${size}`);
    };

    const fetchSettings = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setFormData({
                    name: parsedUser.name,
                    email: parsedUser.email
                });
                setTempFormData({
                    name: parsedUser.name,
                    email: parsedUser.email
                });
            }

            const response = await settingsApi.getPreferences();
            const prefs = response.data.preferences;

            if (prefs) {
                if (prefs.toggles) setToggles(prev => ({ ...prev, ...prefs.toggles }));
                if (prefs.sliders) setSliders(prev => ({ ...prev, ...prefs.sliders }));
                if (prefs.ui_prefs) setPreferences(prev => ({ ...prev, ...prefs.ui_prefs }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const savePreferences = async (updatedToggles, updatedSliders, updatedUiPrefs) => {
        try {
            await settingsApi.updatePreferences({
                toggles: updatedToggles || toggles,
                sliders: updatedSliders || sliders,
                ui_prefs: updatedUiPrefs || preferences
            });
        } catch (error) {
            console.error("Failed to save preferences:", error);
        }
    };

    const handleEditClick = (field) => {
        setEditingField(field);
        setTempFormData({ ...formData });
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            const response = await updateProfileApi(tempFormData);
            const updatedUser = response.data.user;

            setFormData({
                name: updatedUser.name,
                email: updatedUser.email
            });
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setEditingField(null);
            setMessage({ type: "success", text: "Profile updated successfully." });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to update profile."
            });
        } finally {
            setLoading(false);
        }
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

        try {
            await updatePasswordApi({
                current_password: tempPasswordData.currentPassword,
                new_password: tempPasswordData.newPassword
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
        const newValue = !toggles[key];
        const updated = { ...toggles, [key]: newValue };
        setToggles(updated);
        savePreferences(updated, sliders, preferences);

        // Request permission if enabling desktop notifications
        if (key === 'desktopNotifications' && newValue) {
            if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                    if (permission !== "granted") {
                        // Revert if permission denied
                        const reverted = { ...toggles, [key]: false };
                        setToggles(reverted);
                        savePreferences(reverted, sliders, preferences);
                        setMessage({ type: "error", text: "Notification permission denied." });
                    }
                });
            } else {
                setMessage({ type: "error", text: "Notifications not supported in this browser." });
            }
        }
    };

    const handleSliderChange = (key, value) => {
        const updated = { ...sliders, [key]: value };
        setSliders(updated);
        savePreferences(toggles, updated, preferences);
    };

    const handlePreferenceChange = (key, value) => {
        const updated = { ...preferences, [key]: value };
        setPreferences(updated);
        savePreferences(toggles, sliders, updated);

        if (key === 'fontSize') {
            applyFontSize(value);
        }
    };

    const handleExportData = async () => {
        try {
            const response = await settingsApi.exportData();
            const jsonString = JSON.stringify(response.data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", `chatid_data_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            URL.revokeObjectURL(url);

            setMessage({ type: "success", text: "Data exported successfully." });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to export data." });
        }
    };

    const handleClearCache = async () => {
        try {
            await settingsApi.clearCache();
            setMessage({ type: "success", text: "System cache cleared successfully." });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to clear cache." });
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
                            {/* Notifications Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="notifications" className="text-[#fbbf24]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#fbbf24]">
                                        Notification Preferences
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Desktop Notifications */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                                                <MaterialIcon name="desktop_windows" className="text-[#fbbf24]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Desktop Notifications</p>
                                                <p className="text-xs text-[#adaaaa]">Show browser alerts</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.desktopNotifications ? 'bg-[#fbbf24]/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('desktopNotifications')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.desktopNotifications ? 20 : 0 }}
                                                className="w-4 h-4 bg-[#fbbf24] rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Email Alerts */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <MaterialIcon name="email" className="text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Email Alerts</p>
                                                <p className="text-xs text-[#adaaaa]">Important updates via email</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.emailNotifications ? 'bg-blue-500/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('emailNotifications')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.emailNotifications ? 20 : 0 }}
                                                className="w-4 h-4 bg-blue-500 rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            {/* Appearance Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="palette" className="text-[#c084fc]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#c084fc]">
                                        Appearance
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Font Size */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#c084fc]/20 flex items-center justify-center">
                                                <MaterialIcon name="text_fields" className="text-[#c084fc]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Font Size</p>
                                                <p className="text-xs text-[#adaaaa]">Text appearance scale</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {['small', 'medium', 'large'].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handlePreferenceChange('fontSize', size)}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${preferences.fontSize === size
                                                        ? 'bg-[#c084fc] text-white'
                                                        : 'bg-white/5 text-[#adaaaa] hover:bg-white/10'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Show Timestamps */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                                <MaterialIcon name="schedule" className="text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Show Timestamps</p>
                                                <p className="text-xs text-[#adaaaa]">Display message times</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.showTimestamps ? 'bg-cyan-500/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('showTimestamps')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.showTimestamps ? 20 : 0 }}
                                                className="w-4 h-4 bg-cyan-500 rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            {/* Chat Behavior Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="chat" className="text-[#60a5fa]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#60a5fa]">
                                        Chat Behavior
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Send on Enter */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#60a5fa]/20 flex items-center justify-center">
                                                <MaterialIcon name="keyboard_return" className="text-[#60a5fa]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Send on Enter</p>
                                                <p className="text-xs text-[#adaaaa]">Press Enter to send messages</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.sendOnEnter ? 'bg-[#60a5fa]/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('sendOnEnter')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.sendOnEnter ? 20 : 0 }}
                                                className="w-4 h-4 bg-[#60a5fa] rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Auto-scroll to Bottom */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                <MaterialIcon name="vertical_align_bottom" className="text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Auto-scroll to Bottom</p>
                                                <p className="text-xs text-[#adaaaa]">Keep latest messages visible</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${toggles.autoScroll ? 'bg-green-500/30' : 'bg-white/10'}`}
                                            onClick={() => handleToggle('autoScroll')}
                                        >
                                            <motion.div
                                                animate={{ x: toggles.autoScroll ? 20 : 0 }}
                                                className="w-4 h-4 bg-green-500 rounded-full absolute top-1"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            {/* AI Model Configuration */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="smart_toy" className="text-[#f472b6]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#f472b6]">
                                        AI Model Configuration
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Model Selection */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#f472b6]/20 flex items-center justify-center">
                                                <MaterialIcon name="psychology" className="text-[#f472b6]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">AI Model</p>
                                                <p className="text-xs text-[#adaaaa]">Choose language model</p>
                                            </div>
                                        </div>
                                        <select
                                            value={preferences.model}
                                            onChange={(e) => handlePreferenceChange('model', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#f472b6]/50 text-white"
                                        >
                                            <option value="gpt-4">GPT-4 (Most Capable)</option>
                                            <option value="gpt-3.5">GPT-3.5 Turbo (Fast)</option>
                                            <option value="claude-3">Claude 3 Opus</option>
                                            <option value="local-llm">Local LLM (Offline)</option>
                                        </select>
                                    </motion.div>

                                    {/* Context Length */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex flex-col"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#f472b6]/20 flex items-center justify-center">
                                                <MaterialIcon name="account_tree" className="text-[#f472b6]" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-bold text-base">Context Window</p>
                                                    <span className="text-[10px] font-['Space_Grotesk'] text-[#f472b6] font-bold">{sliders.contextLength}%</span>
                                                </div>
                                                <p className="text-xs text-[#adaaaa]">Memory capacity per conversation</p>
                                            </div>
                                        </div>
                                        <div className="relative flex-1">
                                            <input
                                                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#f472b6]"
                                                type="range"
                                                min="10"
                                                max="100"
                                                value={sliders.contextLength}
                                                onChange={(e) => handleSliderChange("contextLength", parseInt(e.target.value))}
                                            />
                                            <motion.div
                                                className="absolute left-0 top-0 h-2 bg-[#f472b6] rounded-lg pointer-events-none"
                                                style={{ width: `${sliders.contextLength}%` }}
                                                transition={springTransition}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[8px] text-[#adaaaa] mt-2">
                                            <span>Compact</span>
                                            <span>Extended</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            {/* Data & Privacy Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <MaterialIcon name="privacy_tip" className="text-[#4ade80]" />
                                    <h2 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#4ade80]">
                                        Data & Privacy
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Export Chat History */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#4ade80]/20 flex items-center justify-center">
                                                <MaterialIcon name="download" className="text-[#4ade80]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Export Chat History</p>
                                                <p className="text-xs text-[#adaaaa]">Download all conversations as JSON</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleExportData}
                                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80]/20 transition-all"
                                        >
                                            Export
                                        </motion.button>
                                    </motion.div>

                                    {/* Clear Cache */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                <MaterialIcon name="cleaning_services" className="text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">Clear Cache</p>
                                                <p className="text-xs text-[#adaaaa]">Remove temporary files</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleClearCache}
                                            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all"
                                        >
                                            Clean
                                        </motion.button>
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