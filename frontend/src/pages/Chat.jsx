import React from "react";
import Sidebar from "../components/Chat/Sidebar";
import Header from "../components/Chat/Header";
import ChatGPT from "../components/Chat/ChatGPT";
import InputBar from "../components/Chat/InputBar";
import RightPanel from "../components/Chat/RightPanel";

export default function Chat() {
    return (
        <div className="h-screen flex bg-[#0e0e0e] text-white overflow-hidden">

            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <main className="flex-1 flex flex-col">

                {/* Header */}
                <Header />

                {/* Chat + Input */}
                <div className="flex-1 flex flex-col">

                    {/* Chat (scroll ở đây) */}
                    <ChatGPT />

                    {/* Input */}
                    <InputBar />
                </div>
            </main>

            {/* Right Panel */}
            <RightPanel />
        </div>
    );
}