import { Cpu, FileText, FileSpreadsheet, FileArchive, Info } from "lucide-react";
import { useState } from "react";

export default function RightPanel() {
  const [autoRender, setAutoRender] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(false);

  return (
    <aside className="w-80 h-screen bg-[#0e0e0e] border-l border-[#20201f] p-6 text-white hidden lg:flex flex-col">

      {/* About */}
      <div className="mb-8">
        <p className="flex items-center justify-between text-xs text-gray-500 mb-4 tracking-wide">
          ABOUT THIS BOT
          <Info size={14} className="text-gray-400" />
        </p>

        <div className="bg-[#151515] p-5 rounded-2xl text-center shadow-lg">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center select-none">
            <Cpu size={32} className="text-white" />
          </div>
          <h2 className="font-semibold text-lg">Architect-v4</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Specialized in structural engineering, urban planning, and sustainable material science.
          </p>

          <div className="flex justify-center gap-3 mt-4">
            <span className="text-xs px-3 py-1 bg-blue-600/25 text-blue-400 rounded-full font-mono tracking-wide">
              CAD-INT
            </span>
            <span className="text-xs px-3 py-1 bg-purple-600/25 text-purple-400 rounded-full font-mono tracking-wide">
              LIVE PRO
            </span>
          </div>
        </div>
      </div>

      {/* Shared files */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-500 tracking-wide">SHARED FILES</p>
          <button className="text-xs text-gray-400 hover:text-white transition">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <FileItem icon={<FileText size={18} />} name="horizon_blueprints.pdf" />
          <FileItem icon={<FileSpreadsheet size={18} />} name="structural_analysis.xlsx" />
          <FileItem icon={<FileArchive size={18} />} name="site_render_v2.zip" />
        </div>
      </div>

      {/* Settings */}
      <div className="mt-auto">
        <p className="text-xs text-gray-500 mb-4 tracking-wide">SETTINGS</p>

        <Toggle label="Auto-generate Renders" checked={autoRender} onChange={() => setAutoRender(!autoRender)} />
        <Toggle label="Voice Feedback" checked={voiceFeedback} onChange={() => setVoiceFeedback(!voiceFeedback)} />

        <button className="w-full mt-6 text-xs bg-[#1a1a1a] hover:bg-[#262626] py-3 rounded-xl font-semibold tracking-wide transition">
          Archive Conversation
        </button>
      </div>
    </aside>
  );
}

function FileItem({ icon, name }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1a1a1a] cursor-pointer transition">
      <div className="text-gray-400">{icon}</div>
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between mb-4 cursor-pointer select-none">
      <span className="text-sm">{label}</span>
      <div
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${checked ? "bg-blue-500" : "bg-gray-700"
          }`}
        onClick={onChange}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full absolute top-0.5 shadow-md transform transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0.5"
            }`}
        />
      </div>
    </label>
  );
}