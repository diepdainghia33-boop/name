import React from "react";

export default function ArchitectDashboard() {
    const menuItems = [
        { name: "Home", icon: "dashboard_customize" },
        { name: "Chat", icon: "forum" },
        { name: "Analytics", icon: "monitoring" },
    ];
    const logs = [
        {
            title: 'Settings Modified',
            desc: 'Engine precision updated to ULTRA. Validated structural weights.',
            time: '12:42 PM · AUG 24',
            icon: 'history_edu',
        },
        {
            title: 'Security Scan',
            desc: 'Global audit complete. 0 vulnerabilities detected in local cache.',
            time: '10:15 AM · AUG 24',
            icon: 'verified_user',
        },
        {
            title: 'New Key Issued',
            desc: 'API v4 integration token generated for Project-X.',
            time: 'YESTERDAY',
            icon: 'vpn_key',
        },
        {
            title: 'Account Login',
            desc: 'Session started from IP 192.168.1.45 (New York, US).',
            time: '2 DAYS AGO',
            icon: 'login',
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#000000] text-white font-sans antialiased selection:bg-[#85adff]/30">

            {/* SIDEBAR - Cố định bên trái */}
            <aside className="h-screen w-[260px] fixed left-0 top-0 bg-[#000000] border-r border-white/[0.05] flex flex-col z-50">
                <div className="p-10 mb-2">
                    <h1 className="text-xl font-black text-[#85adff] tracking-tighter uppercase leading-none">Architect AI</h1>
                    <p className="text-[9px] text-gray-600 font-bold mt-2 uppercase tracking-[3px]">Precision Core v2.4</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => (
                        <a key={item.name} href="#" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] rounded-xl transition-all group">
                            <span className="material-symbols-outlined text-[22px] group-hover:rotate-6 transition-transform">{item.icon}</span>
                            <span className="text-[15px] font-medium tracking-tight">{item.name}</span>
                        </a>
                    ))}
                    <a className="relative flex items-center gap-4 px-4 py-3 text-[#85adff] bg-[#85adff]/5 border-l-[3px] border-[#85adff] mt-4 rounded-r-xl">
                        <span className="material-symbols-outlined text-[22px] fill-current">settings_heart</span>
                        <span className="text-[15px] font-bold tracking-tight">Settings</span>
                    </a>
                </nav>

                <div className="p-6 space-y-1 border-t border-white/[0.05]">
                    <a href="#" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-gray-300 transition-colors group">
                        <span className="material-symbols-outlined text-[20px]">contact_support</span>
                        <span className="text-[14px]">Support</span>
                    </a>
                    <a href="#" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-red-500 transition-colors group">
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
                        <span className="text-[14px]">Logout</span>
                    </a>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="pl-[260px] flex-1 flex h-screen overflow-hidden">

                {/* CENTER COLUMN - Nội dung chính cuộn độc lập */}
                <div className="flex-1 overflow-y-auto bg-[#000000] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col">
                    {/* Header - Sticky */}
                    <header className="h-24 flex shrink-0 items-center justify-between px-12 sticky top-0 bg-black/80 backdrop-blur-xl z-40 border-b border-white/[0.02]">
                        <h1 className="text-[11px] font-black uppercase tracking-[5px] text-white/40">System Configuration</h1>
                        <div className="flex items-center gap-8">
                            <div className="relative cursor-pointer group">
                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-[26px]">notifications</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-black"></span>
                            </div>
                            <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                                <div className="text-right">
                                    <p className="text-sm font-black leading-none tracking-tight">Alex Sterling</p>
                                    <p className="text-[10px] text-[#85adff] font-bold mt-1.5 uppercase tracking-widest">Lead Architect</p>
                                </div>
                                <img src="https://i.pravatar.cc/150?u=alex" className="w-11 h-11 rounded-xl border border-white/10 object-cover" alt="avatar" />
                            </div>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className="p-16 max-w-5xl mx-auto w-full">
                        <div className="mb-20">
                            <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.9]">Core<br />Preferences</h2>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-xl font-medium">
                                Adjust your global architectural parameters, security protocols, and generative engine weights.
                            </p>
                        </div>

                        {/* Account Identity */}
                        <section className="mb-20">
                            <div className="flex items-center gap-3 mb-8 text-white/20">
                                <span className="material-symbols-outlined text-lg">badge</span>
                                <h3 className="text-[11px] font-black uppercase tracking-[3px]">Account Identity</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-[#080808] border border-white/[0.05] p-7 rounded-2xl flex items-center gap-6 hover:bg-[#0c0c0c] transition-colors group">
                                    <img src="https://i.pravatar.cc/150?u=alex" className="w-16 h-16 rounded-xl grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="profile" />
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-600 uppercase font-black mb-1.5 tracking-tighter">Display Name</p>
                                        <p className="text-xl font-bold tracking-tight">Alex Sterling</p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-700 hover:text-white cursor-pointer transition-colors">edit_note</span>
                                </div>
                                <div className="bg-[#080808] border border-white/[0.05] p-7 rounded-2xl flex items-center gap-6 hover:bg-[#0c0c0c] transition-colors">
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-600 uppercase font-black mb-1.5 tracking-tighter">Registry Email</p>
                                        <p className="text-xl font-bold tracking-tight text-white/90">a.sterling@architect.ai</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#85adff] text-2xl opacity-40">verified_user</span>
                                </div>
                            </div>
                        </section>

                        {/* Generative Engine */}
                        <section className="mb-20">
                            <div className="flex items-center gap-3 mb-8 text-white/20">
                                <span className="material-symbols-outlined text-lg">model_training</span>
                                <h3 className="text-[11px] font-black uppercase tracking-[3px]">Generative Engine</h3>
                            </div>
                            <div className="bg-[#080808] border border-white/[0.05] p-10 rounded-[32px]">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <h4 className="text-3xl font-bold mb-4 tracking-tighter italic">Inference Precision</h4>
                                        <p className="text-gray-500 text-base max-w-sm leading-relaxed font-medium">Higher precision increases generation time.</p>
                                    </div>
                                    <div className="bg-black p-2 rounded-full border border-white/[0.03] flex items-center gap-5 pr-6">
                                        <span className="text-[10px] font-black text-gray-700 tracking-[2px] ml-4">STANDARD</span>
                                        <div className="w-32 h-2 bg-[#111] rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-pink-500 tracking-[2px]">ULTRA</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-12">
                                    {[
                                        { label: 'Creativity Bias', val: '0.82', icon: 'auto_awesome' },
                                        { label: 'Detail Density', val: 'HIGH', icon: 'layers' },
                                        { label: 'Optimization Speed', val: 'TURBO', icon: 'bolt' }
                                    ].map(item => (
                                        <div key={item.label} className="group">
                                            <div className="flex justify-between text-[10px] font-black mb-5 tracking-widest text-gray-600 group-hover:text-[#85adff] transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                                    <span className="uppercase">{item.label}</span>
                                                </div>
                                                <span className="text-[#85adff]">{item.val}</span>
                                            </div>
                                            <div className="relative h-[3px] bg-white/[0.03] rounded-full">
                                                <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#85adff] border-[3px] border-black shadow-[0_0_15px_rgba(133,173,255,0.6)] cursor-pointer"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* RIGHT PANEL - Cố định bên phải, cuộn độc lập */}
                <aside className="w-[380px] border-l border-white/[0.05] flex flex-col bg-[#000000] h-screen">
                    <div className="flex-1 overflow-y-auto p-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <h3 className="text-[11px] font-black uppercase tracking-[4px] text-white/20 mb-10">System Status</h3>

                        <div className="space-y-6 mb-12">
                            {[
                                { label: 'Neural Engine', status: 'OPERATIONAL', color: 'bg-[#85adff]' },
                                { label: 'Vector DB', status: 'SYNCED', color: 'bg-green-500' },
                                { label: 'Auth Bridge', status: 'ACTIVE', color: 'bg-purple-500' }
                            ].map(item => (
                                <div key={item.label} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_10px_rgba(133,173,255,0.4)]`}></span>
                                        <span className="text-[14px] text-gray-400 font-bold group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <span className="text-[#85adff] font-black text-[10px] tracking-widest bg-[#85adff]/5 px-2 py-1 rounded-md">{item.status}</span>
                                </div>
                            ))}
                        </div>

                        {/* Core Load Chart */}
                        <div className="bg-[#080808] p-8 rounded-3xl border border-white/[0.05] mb-14">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-[2px]">Core Load</span>
                                <span className="text-xl font-black text-white tracking-tighter">42.8<span className="text-xs text-[#85adff]">%</span></span>
                            </div>
                            <div className="flex items-end gap-1.5 h-14">
                                {[15, 30, 45, 25, 35, 45, 85, 40, 20, 15, 25, 35].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-full transition-all ${i === 6 ? 'bg-[#85adff] shadow-[0_0_15px_#85adff]' : 'bg-white/5'}`}></div>
                                ))}
                            </div>git remote remove origin
                        </div>

                        <h3 className="text-[11px] font-black uppercase tracking-[4px] text-white/20 mb-10">Activity Log</h3>
                        <div className="relative pl-6">
                            {/* Vertical line */}
                            <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/10"></div>



                            <div className="relative pl-5">
                                {/* Timeline line */}
                                <div className="absolute left-[14px] top-0 bottom-0 w-px bg-white/10"></div>

                                <div className="space-y-5">
                                    {logs.slice(0, 5).map((log, idx) => (
                                        <div key={idx} className="group relative flex gap-3">

                                            {/* Dot */}
                                            <div className="absolute left-[-5px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#85adff] shadow-[0_0_6px_#85adff]"></div>

                                            {/* Icon */}
                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#85adff]/40 transition">
                                                <span className="material-symbols-outlined text-[16px] text-gray-500 group-hover:text-[#85adff] transition">
                                                    {log.icon}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="leading-tight">
                                                <p className="text-[13px] font-semibold text-white group-hover:text-[#85adff] transition">
                                                    {log.title}
                                                </p>

                                                {/* ❌ bỏ line-clamp để hiện full */}
                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                    {log.desc}
                                                </p>

                                                <p className="text-[9px] font-bold text-gray-600 uppercase mt-1 tracking-wide">
                                                    {log.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Button */}
                            <div className="mt-10">
                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[12px] font-semibold text-gray-300 hover:bg-white/10 transition">
                                    VIEW FULL ARCHIVE
                                </button>
                            </div>


                        </div>
                    </div>

                    {/* Footer Right Panel */}
                    <div className="p-8 border-t border-white/[0.05] bg-[#050505]">
                        <div className="flex items-center justify-center gap-3 text-gray-700">
                            <span className="material-symbols-outlined text-sm animate-pulse">encrypted</span>
                            <p className="text-[9px] uppercase font-black tracking-[3px]">Quantum Encryption v2</p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}