import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Chart() {
    const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8001/api/analytics");
                if (response.data.data && response.data.data.length > 0) {
                    setData(response.data.data);
                    setDays(response.data.days);
                }
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            }
        };
        fetchAnalytics();
    }, []);

    const width = 300;
    const height = 120;
    const maxVal = Math.max(...data, 10); // Đảm bảo scale không bị quá nhỏ
    const scaleY = (height - 40) / maxVal;
    const offsetY = 20;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - d * scaleY - offsetY;
        return { x, y };
    });

    const linePath = `
        M ${points[0].x} ${points[0].y}
        ${points
            .slice(1)
            .map((p, i) => {
                const prev = points[i];
                const cx = (prev.x + p.x) / 2;
                return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
            })
            .join(" ")}
    `;

    const areaPath = `
        ${linePath}
        L ${width} ${height}
        L 0 ${height}
        Z
    `;

    return (
        <div className="col-span-12 lg:col-span-8 bg-[#0f0f0f] rounded-3xl p-8 border border-[#1f1f1f] hover:border-blue-500/20 transition-all duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">Conversation Trends</h4>
                    <p className="text-xs text-gray-500 font-medium">Daily interaction volume (Last 7 Days)</p>
                </div>
                <div className="flex gap-2 text-[10px] font-black tracking-widest">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">LIVE DATA</span>
                </div>
            </div>

            <div className="h-56 w-full relative">
                <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <motion.path d={areaPath} fill="url(#gradientFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
                    <motion.path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />

                    {points.map((p, i) => (
                        <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
                            <motion.circle cx={p.x} cy={p.y} r={hoverIndex === i ? 5 : 2.5} fill="#60a5fa" animate={{ scale: hoverIndex === i ? 1.5 : 1 }} />
                            {hoverIndex === i && (
                                <foreignObject x={p.x - 20} y={p.y - 35} width="40" height="25">
                                    <div className="bg-blue-600 text-white text-[10px] font-black rounded flex items-center justify-center shadow-lg">
                                        {data[i]}
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    ))}

                    {days.map((day, i) => {
                        const x = (i / (days.length - 1)) * width;
                        return (
                            <text key={i} x={x} y={height - 2} textAnchor="middle" fontSize="7" fontWeight="900" fill="#4b5563" className="uppercase tracking-tighter">
                                {day}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}