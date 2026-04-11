import { MessageSquare, Smile, Gauge } from "lucide-react";

export default function Stats() {
    const data = [
        {
            title: "TOTAL CONVERSATIONS",
            value: "24,892",
            sub: "+12% from last month",
            icon: <MessageSquare size={18} />,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "USER SATISFACTION",
            value: "4.8/5.0",
            sub: "",
            icon: <Smile size={18} />,
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            progress: 80,
        },
        {
            title: "AVG. RESPONSE TIME",
            value: "1.2s",
            sub: "-0.4s improvement",
            icon: <Gauge size={18} />,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-12 gap-6 mb-8">
            {data.map((item, i) => (
                <div
                    key={i}
                    className="col-span-12 md:col-span-4 bg-[#131313] p-6 rounded-2xl"
                >
                    {/* ICON */}
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${item.bg} mb-4`}>
                        <div className={item.color}>
                            {item.icon}
                        </div>
                    </div>

                    {/* TITLE */}
                    <p className="text-xs text-gray-400 tracking-wide">
                        {item.title}
                    </p>

                    {/* VALUE */}
                    <h3 className="text-3xl font-semibold mt-1">
                        {item.value}
                    </h3>

                    {/* PROGRESS (chỉ card giữa) */}
                    {item.progress && (
                        <div className="mt-3 h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-pink-400 rounded-full"
                                style={{ width: `${item.progress}%` }}
                            />
                        </div>
                    )}

                    {/* SUB TEXT */}
                    {item.sub && (
                        <p className={`text-xs mt-2 ${item.sub.includes("-") ? "text-red-400" : "text-blue-400"
                            }`}>
                            {item.sub}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}