import { FaShieldAlt, FaCube, FaTachometerAlt } from "react-icons/fa";

export default function Metrics({ data }) {
    return (
        <section className="grid grid-cols-3 gap-6">
            <Card
                icon={<FaShieldAlt />}
                label="ACTIVE"
                title="System Health"
                value={`${data.health}%`}
                color="text-blue-400"
            />
            <Card
                icon={<FaCube />}
                label="USAGE"
                title="Token Usage"
                value={(data.tokens / 1000000).toFixed(1) + "M"}
                color="text-pink-400"
            />
            <Card
                icon={<FaTachometerAlt />}
                label="NETWORK"
                title="Global Latency"
                value={data.latency + "ms"}
                color="text-blue-300"
            />
        </section>
    );
}

function Card({ icon, label, title, value, color }) {
    return (
        <div className="bg-[#111111] rounded-2xl p-5 border border-[#20201f]">

            {/* 🔹 TOP */}
            <div className="flex items-center justify-between mb-4">
                <div className={`text-lg ${color}`}>
                    {icon}
                </div>
                <span className="text-xs text-gray-500 tracking-widest">
                    {label}
                </span>
            </div>

            {/* 🔹 CONTENT */}
            <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                    {title}
                </p>
                <h3 className="text-2xl font-semibold text-white">
                    {value}
                </h3>
            </div>
        </div>
    );
}