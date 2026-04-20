import { motion } from "framer-motion";

const MaterialIcon = ({ name, className = "" }) => (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
        {name}
    </span>
);

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }
};

function Toggle({ enabled, onChange, label, description, icon }) {
    return (
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#85adff]/20 flex items-center justify-center">
                    <MaterialIcon name={icon} className="text-[#85adff]" />
                </div>
                <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-xs text-[#adaaaa]">{description}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`w-12 h-6 rounded-full relative p-1 transition-all ${
                    enabled ? 'bg-[#85adff]' : 'bg-[#262626]'
                }`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'translate-x-6' : ''}`} />
            </button>
        </div>
    );
}

export default function NotificationSection({ preferences, onUpdate }) {
    const notifications = preferences?.notifications || {
        email: true,
        desktop: true,
        sound: false
    };

    const handleChange = (key, value) => {
        onUpdate({
            notifications: {
                ...notifications,
                [key]: value
            }
        });
    };

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="flex items-center gap-3">
                <MaterialIcon name="notifications" className="text-[#85adff]" />
                <h3 className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.2em] font-semibold text-[#85adff]">
                    Notifications
                </h3>
            </div>
            <div className="space-y-4">
                <Toggle
                    enabled={notifications.email}
                    onChange={(val) => handleChange('email', val)}
                    label="Email Notifications"
                    description="Receive updates via registered email"
                    icon="mail"
                />
                <Toggle
                    enabled={notifications.desktop}
                    onChange={(val) => handleChange('desktop', val)}
                    label="Desktop Alerts"
                    description="Browser push notifications"
                    icon="desktop_windows"
                />
                <Toggle
                    enabled={notifications.sound}
                    onChange={(val) => handleChange('sound', val)}
                    label="Sound Effects"
                    description="Audio feedback on interactions"
                    icon="volume_up"
                />
            </div>
        </motion.section>
    );
}