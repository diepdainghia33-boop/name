export default function Header({ tab, setTab }) {
    const tabs = ["overview", "engine", "logs"];

    return (
        <div className="flex justify-between items-center mb-16">
            <div className="flex gap-8 text-xs uppercase tracking-widest">
                {tabs.map((t) => (
                    <span
                        key={t}
                        onClick={() => setTab(t)}
                        className={`cursor-pointer pb-1 ${tab === t
                                ? "text-blue-400 border-b border-blue-400"
                                : "text-gray-500 hover:text-white"
                            }`}
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="flex gap-4 text-gray-400">
                <span className="material-symbols-outlined">notifications</span>
                <span className="material-symbols-outlined">grid_view</span>
            </div>
        </div>
    );
}