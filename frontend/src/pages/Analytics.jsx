import Sidebar from "../components/Analytics/Sidebar";
import Header from "../components/Analytics/Header";
import Stats from "../components/Analytics/Stats";
import MainContent from "../components/Analytics/MainContent";
import Footer from "../components/Analytics/Footer";

export default function Analytics() {
    return (
        <div className="bg-black text-white min-h-screen">

            {/* SIDEBAR (fixed wrapper) */}
            <div className="fixed inset-y-0 left-0 w-64">
                <Sidebar />
            </div>

            {/* MAIN */}
            <main className="ml-64 p-8">
                <div className="max-w-[1400px] mx-auto space-y-6">

                    {/* HEADER */}
                    <Header />

                    {/* STATS */}
                    <Stats />

                    {/* CONTENT */}
                    <MainContent />

                    {/* FOOTER */}
                    <Footer />
                </div>
            </main>

        </div>
    );
}