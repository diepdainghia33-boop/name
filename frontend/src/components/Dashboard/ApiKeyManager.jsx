import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import MaterialIcon from "./MaterialIcon";
import { apiKeyApi } from "../../api/apiKey.api";
import { systemSettingsApi } from "../../api/systemSettings.api";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

export default function ApiKeyManager({ isOpen, onClose }) {
    const [apiKeys, setApiKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [newKeyPermissions, setNewKeyPermissions] = useState(["read"]);
    const [copiedId, setCopiedId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const [activeTab, setActiveTab] = useState("integration"); // "integration" or "providers"
    const [systemSettings, setSystemSettings] = useState({
        GROQ_API_KEY: "",
        ANTHROPIC_API_KEY: "",
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    const [showKeys, setShowKeys] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // null, "success", "error"

    useEffect(() => {
        if (isOpen) {
            fetchKeys();
            fetchSystemSettings();
        }
    }, [isOpen]);

    const fetchSystemSettings = async () => {
        try {
            const response = await systemSettingsApi.getSettings();
            const settingsMap = {};
            response.data.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            setSystemSettings(prev => ({ ...prev, ...settingsMap }));
        } catch (error) {
            console.error("Failed to fetch system settings:", error);
        }
    };

    const handleSaveSystemSettings = async () => {
        setIsSavingSettings(true);
        setSaveStatus(null);
        try {
            const settingsArray = Object.keys(systemSettings).map(key => ({
                key,
                value: systemSettings[key]
            }));
            await systemSettingsApi.updateSettings(settingsArray);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error("Failed to save system settings:", error);
            setSaveStatus("error");
        } finally {
            setIsSavingSettings(false);
        }
    };

    const fetchKeys = async () => {
        setIsLoading(true);
        try {
            const response = await apiKeyApi.getKeys();
            setApiKeys(response.data);
        } catch (error) {
            console.error("Failed to fetch API keys:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;

        try {
            const response = await apiKeyApi.createKey({
                name: newKeyName,
                permissions: newKeyPermissions,
            });
            setApiKeys([response.data, ...apiKeys]);
            setNewKeyName("");
            setNewKeyPermissions(["read"]);
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create API key:", error);
        }
    };

    const handleDeleteKey = async (id) => {
        try {
            await apiKeyApi.deleteKey(id);
            setApiKeys(apiKeys.filter((key) => key.id !== id));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Failed to delete API key:", error);
        }
    };

    const handleCopyKey = (id, key) => {
        navigator.clipboard.writeText(key);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleToggleActive = () => {
        // UI only in this version.
    };

    const handlePermissionToggle = (perm) => {
        setNewKeyPermissions((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const maskKey = (key) => {
        if (!key) return "";
        return `${key.substring(0, 12)}${"•".repeat(20)}${key.substring(key.length - 4)}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60]"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={springTransition}
                        className="absolute right-0 top-16 z-[70] flex max-h-[85vh] w-[32rem] flex-col overflow-hidden rounded-[28px] border border-border/70 bg-background-elevated shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
                    >
                        <div className="border-b border-border/70 bg-surface">
                            <div className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-text">
                                        <MaterialIcon name="key" className="text-accent" />
                                        API Key Access
                                    </h3>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Manage integration tokens & providers
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-xl border border-border/70 p-2 text-muted transition-colors hover:border-accent/40 hover:text-text"
                                >
                                    <MaterialIcon name="close" />
                                </button>
                            </div>
                            
                            <div className="flex gap-4 px-5 pb-2">
                                <button
                                    onClick={() => setActiveTab("integration")}
                                    className={`relative pb-2 text-[0.625rem] font-black uppercase tracking-[0.2em] transition-colors ${
                                        activeTab === "integration" ? "text-accent" : "text-muted hover:text-text"
                                    }`}
                                >
                                    Integration Tokens
                                    {activeTab === "integration" && (
                                        <motion.div layoutId="apiKeyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("providers")}
                                    className={`relative pb-2 text-[0.625rem] font-black uppercase tracking-[0.2em] transition-colors ${
                                        activeTab === "providers" ? "text-accent" : "text-muted hover:text-text"
                                    }`}
                                >
                                    Service Providers
                                    {activeTab === "providers" && (
                                        <motion.div layoutId="apiKeyTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
                            {isLoading && activeTab === "integration" ? (
                                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                                    <p className="text-sm text-text-muted">Loading API keys...</p>
                                </div>
                            ) : activeTab === "providers" ? (
                                <div className="space-y-6 p-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted">Cloud Provider Keys</h4>
                                        <button 
                                            onClick={() => setShowKeys(!showKeys)}
                                            className="flex items-center gap-1 text-[10px] font-bold text-accent"
                                        >
                                            <MaterialIcon name={showKeys ? "visibility_off" : "visibility"} className="text-sm" />
                                            {showKeys ? "Hide Keys" : "Show Keys"}
                                        </button>
                                    </div>

                                    <div className="rounded-[26px] border border-border/70 bg-surface p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                                <MaterialIcon name="bolt" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-text">Groq Cloud</h4>
                                                <p className="text-[10px] text-text-muted">High-speed inference API</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted">
                                                    GROQ_API_KEY
                                                </label>
                                                <input
                                                    type={showKeys ? "text" : "password"}
                                                    value={systemSettings.GROQ_API_KEY}
                                                    onChange={(e) => setSystemSettings(prev => ({ ...prev, GROQ_API_KEY: e.target.value }))}
                                                    placeholder="gsk_..."
                                                    className="app-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-[26px] border border-border/70 bg-surface p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                                <MaterialIcon name="psychology" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-text">Anthropic</h4>
                                                <p className="text-[10px] text-text-muted">Claude LLM access</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted">
                                                    ANTHROPIC_API_KEY
                                                </label>
                                                <input
                                                    type={showKeys ? "text" : "password"}
                                                    value={systemSettings.ANTHROPIC_API_KEY}
                                                    onChange={(e) => setSystemSettings(prev => ({ ...prev, ANTHROPIC_API_KEY: e.target.value }))}
                                                    placeholder="sk-ant-..."
                                                    className="app-input"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleSaveSystemSettings}
                                            disabled={isSavingSettings}
                                            className="app-button-primary w-full"
                                        >
                                            {isSavingSettings ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                                                    Saving...
                                                </span>
                                            ) : saveStatus === "success" ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <MaterialIcon name="check" className="text-sm" />
                                                    Saved Successfully
                                                </span>
                                            ) : "Save Provider Keys"}
                                        </button>
                                        
                                        {saveStatus === "success" && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center text-[10px] font-bold text-success"
                                            >
                                                Keys updated! Please restart AI Service (Port 8001).
                                            </motion.p>
                                        )}
                                    </div>
                                    
                                    <p className="text-center text-[10px] text-text-dim">
                                        Note: System configuration is shared across all users.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {!showCreateForm && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={() => setShowCreateForm(true)}
                                            className="mb-4 flex w-full items-center justify-center gap-2 rounded-[22px] border border-dashed border-border/70 bg-surface px-4 py-4 text-accent transition-colors hover:border-accent/50 hover:bg-surface-strong"
                                        >
                                            <MaterialIcon name="add" />
                                            <span className="text-sm font-bold">Create new API key</span>
                                        </motion.button>
                                    )}

                                    <AnimatePresence>
                                        {showCreateForm && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-4 overflow-hidden rounded-[26px] border border-border/70 bg-surface p-4"
                                            >
                                                <h4 className="text-base font-bold text-text">Generate new key</h4>
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <label className="mb-2 block text-[0.625rem] font-black uppercase tracking-[0.28em] text-muted">
                                                            Key name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={newKeyName}
                                                            onChange={(e) => setNewKeyName(e.target.value)}
                                                            placeholder="e.g., Production Server"
                                                            className="app-input"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-2 block text-[0.625rem] font-black uppercase tracking-[0.28em] text-muted">
                                                            Permissions
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["read", "write", "delete"].map((perm) => (
                                                                <button
                                                                    key={perm}
                                                                    type="button"
                                                                    onClick={() => handlePermissionToggle(perm)}
                                                                    className={`rounded-full px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] transition-colors ${
                                                                        newKeyPermissions.includes(perm)
                                                                            ? "bg-accent text-background"
                                                                            : "bg-background-elevated text-text-muted hover:bg-surface-strong hover:text-text"
                                                                    }`}
                                                                >
                                                                    {perm}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleCreateKey}
                                                            disabled={!newKeyName.trim()}
                                                            className="app-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            Generate key
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowCreateForm(false);
                                                                setNewKeyName("");
                                                                setNewKeyPermissions(["read"]);
                                                            }}
                                                            className="app-button-secondary px-4"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                        {apiKeys.length === 0 ? (
                                            <div className="rounded-[26px] border border-border/70 bg-surface p-8 text-center">
                                                <MaterialIcon name="key_off" className="mx-auto text-4xl text-muted" />
                                                <p className="mt-3 text-sm text-text-muted">No API keys yet</p>
                                                <p className="mt-1 text-xs text-text-dim">Create one to get started</p>
                                            </div>
                                        ) : (
                                            apiKeys.map((key, index) => (
                                                <motion.div
                                                    key={key.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="rounded-[26px] border border-border/70 bg-surface p-4 transition-colors hover:border-accent/30"
                                                >
                                                    <div className="mb-3 flex items-start justify-between gap-3">
                                                        <div>
                                                            <h4 className="text-sm font-bold tracking-tight text-text">{key.name}</h4>
                                                            <p className="mt-1 text-xs text-text-muted">
                                                                Created {key.createdAt} • Used {key.lastUsed}
                                                            </p>
                                                        </div>
                                                        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${key.active ? "bg-success" : "bg-text-dim"}`} />
                                                    </div>

                                                    <div className="mb-3 flex items-center gap-2">
                                                        <code className="flex-1 rounded-xl border border-border/70 bg-background px-3 py-2 text-xs text-accent">
                                                            {maskKey(key.key)}
                                                        </code>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyKey(key.id, key.key)}
                                                            className="rounded-xl border border-border/70 p-2 text-muted transition-colors hover:border-accent/40 hover:text-text"
                                                            title="Copy full key"
                                                        >
                                                            <MaterialIcon
                                                                name={copiedId === key.id ? "check" : "content_copy"}
                                                                className={copiedId === key.id ? "text-success" : "text-inherit"}
                                                            />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {key.permissions.map((perm) => (
                                                                <span
                                                                    key={perm}
                                                                    className="rounded-full border border-border/70 bg-background-elevated px-2 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] text-text-muted"
                                                                >
                                                                    {perm}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleActive(key.id)}
                                                                className={`rounded-full px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] transition-colors ${
                                                                    key.active
                                                                        ? "bg-success/10 text-success"
                                                                        : "bg-text-dim/10 text-text-dim"
                                                                }`}
                                                            >
                                                                {key.active ? "Active" : "Disabled"}
                                                            </button>

                                                            {deleteConfirmId === key.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteKey(key.id)}
                                                                        className="rounded-full bg-danger/10 px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] text-danger transition-colors hover:bg-danger/20"
                                                                    >
                                                                        Confirm
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDeleteConfirmId(null)}
                                                                        className="rounded-full border border-border/70 px-3 py-1 text-[0.625rem] font-black uppercase tracking-[0.24em] text-text-muted transition-colors hover:text-text"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteConfirmId(key.id)}
                                                                    className="rounded-xl border border-border/70 p-2 text-danger transition-colors hover:border-danger/30 hover:bg-danger/10"
                                                                    title="Delete key"
                                                                >
                                                                    <MaterialIcon name="delete" className="text-inherit" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="border-t border-border/70 bg-surface px-4 py-3">
                            <p className="text-center text-[0.625rem] text-text-muted">
                                Keep your API keys secure. Never share them publicly.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

