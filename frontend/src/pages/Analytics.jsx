import { useState, useEffect } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Analytics/Header";
import Stats from "../components/Analytics/Stats";
import MainContent from "../components/Analytics/MainContent";
import Footer from "../components/Analytics/Footer";
import { motion } from "framer-motion";

export default function Analytics() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="flex h-screen bg-black text-white">
            <SidebarLeft user={user} />

            <main className="flex-1 p-8 ml-72 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto">
                    <Header />
                    <Stats />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <MainContent />
                    </motion.div>
                    <div className="mt-7">
                        <Footer />
                    </div>

                </div>
            </main>
        </div>
    );
}