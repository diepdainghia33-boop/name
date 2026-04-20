export default function Footer() {
    return (
        <footer className="mt-auto py-6 px-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left */}
                <div className="flex items-center gap-6">
                    <span className="text-gray-600 text-xs">© 2024 Ethereal Architect AI</span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Privacy</a>
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Documentation</a>
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Support</a>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
            </div>
        </footer>
    );
}
