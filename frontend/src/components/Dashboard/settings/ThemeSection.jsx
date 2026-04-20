import { motion } from "framer-motion";

const MaterialIcon = ({ name, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
        {name}
    </span>
);

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ThemeSection({ preferences, onUpdate }) {
    const currentTheme = preferences?.theme || 'dark';

    const themes = [
        { id: 'light', label: 'Light', bg: 'bg-white', text: 'text-gray-900', icon: 'light_mode' },
        { id: 'dark', label: 'Dark', bg: 'bg-[#0e0e0e]', text: 'text-white', icon: 'dark_mode' },
    ];

    const handleThemeChange = (themeId) => {
        onUpdate({ theme: themeId });
    };

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex items-center gap-3">
                <MaterialIcon name="palette" className="text-[#fbabff]" />
                <h3 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#fbabff]">
                    Theme / Appearance
                </h3>
            </div>
            <div className="bg-black/20 p-8 rounded-xl border border-white/5">
                <div className="mb-6">
                    <h4 className="font-bold text-lg mb-1">Interface Theme</h4>
                    <p className="text-sm text-[#adaaaa]">Select your preferred color scheme with live preview.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {themes.map((theme) => (
                        <div
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={`p-6 rounded-xl border cursor-pointer transition-all hover:bg-black/40 ${
                                currentTheme === theme.id
                                    ? 'border-[#fbabff] bg-[#fbabff]/5'
                                    : 'border-white/5 bg-black/20'
                            }`}
                        >
                            <div className={`w-full h-24 rounded-lg mb-4 flex items-center justify-center ${theme.bg}`}>
                                <MaterialIcon name={theme.icon} className={`text-3xl ${theme.text}`} />
                            </div>
                            <p className={`font-bold text-center ${theme.text}`}>{theme.label}</p>
                            {currentTheme === theme.id && (
                                <div className="flex justify-center mt-2">
                                    <MaterialIcon name="check_circle" className="text-[#fbabff]" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}