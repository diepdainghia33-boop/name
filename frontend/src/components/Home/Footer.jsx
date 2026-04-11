export default function Footer() {
    return (
        <footer className="relative bg-black text-white px-6 md:px-12 pt-20 pb-10 border-t border-white/10">

            {/* ===== CONTAINER ===== */}
            <div className="max-w-6xl mx-auto">

                {/* ===== TOP ===== */}
                <div className="grid md:grid-cols-2 gap-16 mb-16">

                    {/* LEFT */}
                    <div>
                        <h3 className="text-xl font-semibold text-blue-400">
                            Architect AI
                        </h3>

                        <p className="text-gray-300 mt-4 max-w-sm text-sm leading-relaxed">
                            Building the future of intelligent design systems.
                            Empowering creators with next-gen AI tools.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-sm">

                        <div>
                            <h4 className="text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer">Features</li>
                                <li className="hover:text-white cursor-pointer">Pricing</li>
                                <li className="hover:text-white cursor-pointer">API</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer">About</li>
                                <li className="hover:text-white cursor-pointer">Careers</li>
                                <li className="hover:text-white cursor-pointer">Blog</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer">Docs</li>
                                <li className="hover:text-white cursor-pointer">Guides</li>
                                <li className="hover:text-white cursor-pointer">Support</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer">Privacy</li>
                                <li className="hover:text-white cursor-pointer">Terms</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* ===== BOTTOM ===== */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-gray-400 text-sm">
                        © 2026 Architect AI. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-gray-400 text-sm">
                        <span className="hover:text-white cursor-pointer">Privacy</span>
                        <span className="hover:text-white cursor-pointer">Terms</span>
                        <span className="hover:text-white cursor-pointer">API</span>
                        <span className="hover:text-white cursor-pointer">Support</span>
                    </div>

                </div>
            </div>
        </footer>
    );
}