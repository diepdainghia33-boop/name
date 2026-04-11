export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-72 right-0 py-4 px-8 border-t border-gray-800 flex justify-between items-center text-xs bg-black text-gray-400">

            {/* Left side */}
            <div className="flex items-center gap-4">
                <span className="text-blue-400 font-semibold">Architect AI</span>
                <span>© 2024 Ethereal Architect AI. Built for the future.</span>
            </div>

            {/* Right side */}
            <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">API Documentation</a>
                <a href="#" className="hover:text-white transition">Support</a>
            </div>

        </footer>
    );
}