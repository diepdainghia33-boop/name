import { useState, useEffect } from "react";
import SidebarLeft from "../components/Dashboard/SidebarLeft";
import Header from "../components/Analytics/Header";
import Stats from "../components/Analytics/Stats";
import MainContent from "../components/Analytics/MainContent";
import Footer from "../components/Analytics/Footer";

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
                <div className="max-w-[1400px] mx-auto space-y-6">
                    <Header />
                    <Stats />
                    <MainContent />
                    <Footer />
                </div>
            </main>
        </div>
    );
}