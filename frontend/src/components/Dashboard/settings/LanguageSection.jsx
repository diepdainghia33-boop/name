import { motion } from "framer-motion";

const MaterialIcon = ({ name, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
        {name}
    </span>
);

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }
};

export default function LanguageSection({ preferences, onUpdate }) {
    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
        { code: 'zh', label: '中文', flag: '🇨🇳' },
    ];

    const dateFormats = [
        { id: 'MDY', label: 'MM/DD/YYYY', example: '04/20/2026' },
        { id: 'DMY', label: 'DD/MM/YYYY', example: '20/04/2026' },
        { id: 'YMD', label: 'YYYY-MM-DD', example: '2026-04-20' },
    ];

    const timezones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'Asia/Ho_Chi_Minh', label: 'Vietnam (UTC+7)' },
        { value: 'America/New_York', label: 'New York (UTC-5)' },
        { value: 'Europe/London', label: 'London (UTC+0)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
    ];

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex items-center gap-3">
                <MaterialIcon name="language" className="text-[#8097ff]" />
                <h3 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#8097ff]">
                    Language & Region
                </h3>
            </div>
            <div className="bg-black/20 p-8 rounded-xl border border-white/5 space-y-8">
                <div>
                    <h4 className="font-bold text-lg mb-4">Interface Language</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => onUpdate({ language: lang.code })}
                                className={`p-4 rounded-xl border transition-all hover:bg-black/40 ${
                                    preferences?.language === lang.code
                                        ? 'border-[#8097ff] bg-[#8097ff]/5'
                                        : 'border-white/5 bg-black/20'
                                }`}
                            >
                                <span className="text-2xl mb-2 block">{lang.flag}</span>
                                <span className="text-sm font-bold">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-4">Timezone</h4>
                    <select
                        value={preferences?.timezone || 'UTC'}
                        onChange={(e) => onUpdate({ timezone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#8097ff]"
                    >
                        {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <h4 className="font-bold text-lg mb-4">Date Format</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {dateFormats.map((format) => (
                            <button
                                key={format.id}
                                onClick={() => onUpdate({ date_format: format.id })}
                                className={`p-4 rounded-xl border transition-all hover:bg-black/40 ${
                                    preferences?.date_format === format.id
                                        ? 'border-[#8097ff] bg-[#8097ff]/5'
                                        : 'border-white/5 bg-black/20'
                                }`}
                            >
                                <p className="font-bold">{format.label}</p>
                                <p className="text-xs text-[#adaaaa] mt-1">{format.example}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}