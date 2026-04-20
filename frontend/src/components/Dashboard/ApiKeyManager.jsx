import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MaterialIcon from "./MaterialIcon";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

const initialApiKeys = [
    {
        id: 1,
        name: "Production Server",
        key: "sk-7x8a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
        createdAt: "2024-01-15",
        lastUsed: "2 hours ago",
        permissions: ["read", "write", "delete"],
        active: true
    },
    {
        id: 2,
        name: "Development Environment",
        key: "sk-dev_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
        createdAt: "2024-02-20",
        lastUsed: "1 day ago",
        permissions: ["read", "write"],
        active: true
    },
    {
        id: 3,
        name: "Testing Bot",
        key: "sk-test_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3h2g1f0",
        createdAt: "2024-03-10",
        lastUsed: "1 week ago",
        permissions: ["read"],
        active: false
    }
];

export default function ApiKeyManager({ isOpen, onClose }) {
    const [apiKeys, setApiKeys] = useState(initialApiKeys);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [newKeyPermissions, setNewKeyPermissions] = useState(["read"]);
    const [copiedId, setCopiedId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleCreateKey = () => {
        if (!newKeyName.trim()) return;

        const newKey = {
            id: Date.now(),
            name: newKeyName,
            key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
            createdAt: new Date().toISOString().split('T')[0],
            lastUsed: "Never",
            permissions: [...newKeyPermissions],
            active: true
        };

        setApiKeys([...apiKeys, newKey]);
        setNewKeyName("");
        setNewKeyPermissions(["read"]);
        setShowCreateForm(false);
    };

    const handleDeleteKey = (id) => {
        setApiKeys(apiKeys.filter(key => key.id !== id));
        setDeleteConfirmId(null);
    };

    const handleCopyKey = (id, key) => {
        navigator.clipboard.writeText(key);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleToggleActive = (id) => {
        setApiKeys(apiKeys.map(key =>
            key.id === id ? { ...key, active: !key.active } : key
        ));
    };

    const handlePermissionToggle = (perm) => {
        setNewKeyPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        );
    };

    const maskKey = (key) => {
        if (!key) return "";
        return key.substring(0, 12) + "•".repeat(20) + key.substring(key.length - 4);
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
                        className="absolute right-0 top-16 w-[32rem] max-h-[85vh] bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
                    >
                        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <MaterialIcon name="key" className="text-[#85adff]" />
                                    API Key Access
                                </h3>
                                <p className="text-xs text-[#adaaaa] mt-1">Manage integration tokens</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <MaterialIcon name="close" className="text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {!showCreateForm && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => setShowCreateForm(true)}
                                    className="w-full mb-4 p-3 border-2 border-dashed border-white/10 rounded-xl text-[#85adff] hover:border-[#85adff]/50 hover:bg-[#85adff]/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <MaterialIcon name="add" />
                                    <span className="font-bold text-sm">Create New API Key</span>
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {showCreateForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 p-4 rounded-xl bg-black/20 border border-white/5 overflow-hidden"
                                    >
                                        <h4 className="font-bold text-white mb-3">Generate New Key</h4>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-[#adaaaa] block mb-1">Key Name</label>
                                                <input
                                                    type="text"
                                                    value={newKeyName}
                                                    onChange={(e) => setNewKeyName(e.target.value)}
                                                    placeholder="e.g., Production Server"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#85adff]/50"
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-[#adaaaa] block mb-2">Permissions</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["read", "write", "delete"].map(perm => (
                                                        <button
                                                            key={perm}
                                                            onClick={() => handlePermissionToggle(perm)}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                                newKeyPermissions.includes(perm)
                                                                    ? "bg-[#85adff] text-white"
                                                                    : "bg-white/5 text-[#adaaaa] hover:bg-white/10"
                                                            }`}
                                                        >
                                                            {perm.toUpperCase()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCreateKey}
                                                    disabled={!newKeyName.trim()}
                                                    className="flex-1 py-2 bg-[#85adff] text-black font-bold rounded-lg hover:bg-[#85adff]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    Generate Key
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowCreateForm(false);
                                                        setNewKeyName("");
                                                        setNewKeyPermissions(["read"]);
                                                    }}
                                                    className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
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
                                    <div className="text-center py-8 text-[#adaaaa]">
                                        <MaterialIcon name="key_off" className="text-4xl mb-2 opacity-50" />
                                        <p className="text-sm">No API keys yet</p>
                                        <p className="text-xs mt-1">Create one to get started</p>
                                    </div>
                                ) : (
                                    apiKeys.map((key, index) => (
                                        <motion.div
                                            key={key.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{key.name}</h4>
                                                    <p className="text-xs text-[#adaaaa] mt-0.5">
                                                        Created {key.createdAt} • Used {key.lastUsed}
                                                    </p>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full mt-1 ${key.active ? 'bg-green-400' : 'bg-gray-500'}`} />
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <code className="flex-1 bg-black/40 px-3 py-2 rounded text-xs font-mono text-[#85adff] border border-white/5">
                                                    {maskKey(key.key)}
                                                </code>
                                                <button
                                                    onClick={() => handleCopyKey(key.id, key.key)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Copy full key"
                                                >
                                                    <MaterialIcon
                                                        name={copiedId === key.id ? "check" : "content_copy"}
                                                        className={copiedId === key.id ? "text-green-400" : "text-gray-400"}
                                                    />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {key.permissions.map(perm => (
                                                        <span
                                                            key={perm}
                                                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-[#adaaaa]"
                                                        >
                                                            {perm}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleActive(key.id)}
                                                        className={`text-xs font-bold px-2 py-1 rounded transition-all ${
                                                            key.active
                                                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                                : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                                                        }`}
                                                    >
                                                        {key.active ? "ACTIVE" : "DISABLED"}
                                                    </button>

                                                    {deleteConfirmId === key.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDeleteKey(key.id)}
                                                                className="text-xs font-bold px-2 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                                                            >
                                                                Confirm?
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirmId(null)}
                                                                className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded hover:bg-white/10"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirmId(key.id)}
                                                            className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                                                            title="Delete key"
                                                        >
                                                            <MaterialIcon name="delete" className="text-red-400/70 hover:text-red-400" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-3 border-t border-white/5 bg-black/20">
                            <p className="text-[10px] text-[#adaaaa] text-center">
                                Keep your API keys secure. Never share them publicly.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
