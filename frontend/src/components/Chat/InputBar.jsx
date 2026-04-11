import { Send, Paperclip, Mic } from "lucide-react";

export default function InputBar() {
  return (
    <div className="border-t border-[#1f1f1f] p-4">
      <div className="max-w-3xl mx-auto flex items-center gap-2 bg-[#141414] px-3 py-2 rounded-xl">

        <Paperclip size={16} className="text-gray-400" />

        <input
          placeholder="Command the architect..."
          className="flex-1 bg-transparent outline-none text-sm"
        />

        <Mic size={16} className="text-gray-400" />

        <button className="bg-blue-600 p-2 rounded-lg">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}