export default function ChatGPT() {
  return (
    <section className="flex-1 overflow-y-auto px-6 py-6 pb-28">
      <div className="max-w-3xl mx-auto space-y-6 text-sm">

        {/* AI */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          <p>
            I've analyzed the structural integrity reports...{" "}
            <span className="text-blue-400 font-medium">Tuned Mass Damper</span>
          </p>
        </div>

        {/* USER */}
        <div className="flex justify-end">
          <div className="bg-[#1a1a1a] px-4 py-3 rounded-xl max-w-md">
            Yes, please. Also compare carbon-neutral concrete...
          </div>
        </div>

        {/* RESULT */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />

          <div className="space-y-4">
            <p>
              Simulation complete.{" "}
              <span className="text-blue-400">carbon-neutral variant</span> shows 12% increase...
            </p>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-[#141414] p-4 rounded-xl">
                <div className="h-24 bg-black rounded mb-2" />
                <p className="font-medium">Standard Mix</p>
                <p className="text-xs text-gray-500">Density: 2400 kg/m³</p>
              </div>

              <div className="bg-[#141414] p-4 rounded-xl border border-blue-500">
                <div className="h-24 bg-black rounded mb-2" />
                <p className="font-medium text-blue-400">Eco-Architect v2</p>
                <p className="text-xs text-gray-500">Density: 2250 kg/m³</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}