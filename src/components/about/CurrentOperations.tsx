export const CurrentOperations = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-12 px-6" id="current-operations">
      <div className="mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white tracking-tighter">CURRENT OPERATIONS</h2>
        <div className="h-1 w-16 bg-primary"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/60 border border-primary/30 rounded-2xl p-8 font-mono text-sm backdrop-blur-xl shadow-[0_0_30px_rgba(0,212,255,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
            <span className="text-primary tracking-[0.3em] text-xs uppercase">SAJID.OS // SYSTEM STATUS</span>
          </div>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between"><span className="text-gray-500">STATUS</span><span className="text-green-400 font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-500">LOCATION</span><span className="text-white">BENGALURU, INDIA</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CGPA</span><span className="text-white">8.5 / 10</span></div>
            <div className="w-full h-px bg-white/10 my-4"></div>
            <div>
              <span className="text-gray-500 block mb-3">CURRENT FOCUS</span>
              <div className="space-y-2">
                {['AI ENGINEERING', 'COMPUTER VISION', 'FULL STACK SYSTEMS', 'CLOUD INFRASTRUCTURE'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white"><span className="text-primary">▸</span><span>{f}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/60 border border-secondary/30 rounded-2xl p-8 font-mono text-sm backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#8B5CF6]"></span>
            <span className="text-secondary tracking-[0.3em] text-xs uppercase">AVAILABILITY</span>
          </div>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between"><span className="text-gray-500">OPEN TO</span><span className="text-white">INTERNSHIPS</span></div>
            <div className="flex justify-between"><span className="text-gray-500">COLLAB</span><span className="text-white">YES</span></div>
            <div className="flex justify-between"><span className="text-gray-500">REMOTE</span><span className="text-green-400 font-bold">READY</span></div>
            <div className="w-full h-px bg-white/10 my-4"></div>
            <div>
              <span className="text-gray-500 block mb-3">AVAILABLE FOR</span>
              <div className="space-y-2">
                {['INTERNSHIPS', 'FREELANCE PROJECTS', 'OPEN SOURCE', 'RESEARCH COLLAB'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white"><span className="text-secondary">▸</span><span>{f}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
