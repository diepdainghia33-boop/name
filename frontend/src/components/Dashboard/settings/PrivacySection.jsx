import { useState } from "react";
import { motion } from "framer-motion";

const MaterialIcon = ({ name, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
        {name}
    </span>
);

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }
};

export default function PrivacySection({ user, onMessage }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { settingsApi } = require("../../../api/settings.api");

    const handleExportData = async () => {
        setLoading(true);
        try {
            const response = await settingsApi.exportData();
            const dataStr = JSON.stringify(response.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `architect-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            onMessage({ type: "success", text: "Data exported successfully." });
        } catch (error) {
            onMessage({ type: "error", text: "Export failed." });
        } finally {
            setLoading(false);
        }
    };

    const handleClearCache = async () => {
        setLoading(true);
        try {
            await settingsApi.clearCache();
            onMessage({ type: "success", text: "Cache cleared successfully." });
        } catch (error) {
            onMessage({ type: "error", text: "Failed to clear cache." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteEmail !== user?.email) {
            onMessage({ type: "error", text: "Email confirmation does not match." });
            return;
        }
        setLoading(true);
        try {
            await settingsApi.deleteAccount(deleteEmail);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } catch (error) {
            onMessage({ type: "error", text: "Account deletion failed." });
            setLoading(false);
        }
    };

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex items-center gap-3">
                <MaterialIcon name="security" className="text-[#ff8585]" />
                <h3 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#ff8585]">
                    Privacy & Data
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#85adff]/20 flex items-center justify-center">
                            <MaterialIcon name="download" className="text-[#85adff]" />
                        </div>
                        <div>
                            <p className="font-bold">Export Data</p>
                            <p className="text-xs text-[#adaaaa]">Download all your data as JSON</p>
                        </div>
                    </div>
                    <button
                        onClick={handleExportData}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-[#85adff]/20 text-[#85adff] hover:bg-[#85adff]/30 transition-all text-sm font-semibold disabled:opacity-50"
                    >
                        Export
                    </button>
                </div>

                <div className="p-6 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#fbabff]/20 flex items-center justify-center">
                            <MaterialIcon name="delete_sweep" className="text-[#fbabff]" />
                        </div>
                        <div>
                            <p className="font-bold">Clear Cache</p>
                            <p className="text-xs text-[#adaaaa]">Remove temporary files and data</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClearCache}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-[#fbabff]/20 text-[#fbabff] hover:bg-[#fbabff]/30 transition-all text-sm font-semibold disabled:opacity-50"
                    >
                        Clear
                    </button>
                </div>

                <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <MaterialIcon name="warning" className="text-red-500" />
                        </div>
                        <div>
                            <p className="font-bold text-red-400">Delete Account</p>
                            <p className="text-xs text-[#adaaaa]">Permanently remove your account and all data</p>
                        </div>
                    </div>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold border border-red-500/30"
                        >
                            I want to delete my account
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-[#adaaaa]">Type your email <span className="text-red-400 font-mono">{user?.email}</span> to confirm:</p>
                            <input
                                type="email"
                                value={deleteEmail}
                                onChange={(e) => setDeleteEmail(e.target.value)}
                                placeholder="Confirm your email"
                                className="w-full bg-black/40 border border-red-500/30 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteEmail !== user?.email || loading}
                                    className="flex-1 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Deleting..." : "Permanently Delete"}
                                </button>
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteEmail(""); }}
                                    className="px-6 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}