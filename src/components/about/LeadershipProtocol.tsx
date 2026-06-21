import { Users, Presentation, TerminalSquare, ShieldCheck } from 'lucide-react'

export const LeadershipProtocol = () => {
  const responsibilities = [
    { icon: <Users size={24} />, title: "Students Mentored", value: "100+" },
    { icon: <Presentation size={24} />, title: "Workshops Organized", value: "Multiple" },
    { icon: <TerminalSquare size={24} />, title: "Hackathons Managed", value: "Scale Ops" },
    { icon: <ShieldCheck size={24} />, title: "Technical Operations", value: "Led" },
  ]

  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6" id="leadership">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tighter">LEADERSHIP PROTOCOL</h2>
        <div className="h-1 w-16 bg-primary"></div>
      </div>

      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        {/* Animated background lines */}
        <div className="absolute -left-full top-1/4 w-[200%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        <div className="absolute -left-full top-3/4 w-[200%] h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out delay-100"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          {/* Left Panel: Role */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-12">
            <div className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
              Active Role
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">Tech<br />Co-Lead</h3>
            <p className="text-xl text-gray-400 font-mono tracking-widest uppercase">Cognito Club</p>
            <div className="mt-8 px-4 py-2 bg-white/5 border border-white/10 rounded font-mono text-xs text-gray-400 inline-block">
              AUTHORITY LEVEL: MAXIMUM
            </div>
          </div>

          {/* Right Panel: Data Nodes */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {responsibilities.map((res, idx) => (
              <div key={idx} className="bg-black/50 border border-white/5 p-6 rounded-2xl hover:bg-white/5 hover:border-primary/30 transition-colors flex flex-col justify-between group/card">
                <div className="text-white/20 group-hover/card:text-primary transition-colors mb-8">
                  {res.icon}
                </div>
                <div>
                  <div className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">{res.title}</div>
                  <div className="text-2xl font-bold text-white">{res.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
