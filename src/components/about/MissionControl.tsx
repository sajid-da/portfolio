import { Activity, Cloud, Code2, Trophy } from 'lucide-react'
import { FaUniversity, FaBrain } from 'react-icons/fa'
import { SiGooglecloud, SiCoursera } from 'react-icons/si'

export const MissionControl = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6" id="about">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tighter">MISSION CONTROL</h2>
        <div className="h-1 w-16 bg-primary"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-primary/10 transition-colors duration-500"><Code2 size={120} /></div>
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">PROJECTS BUILT</p>
          <div className="text-6xl font-black text-white relative z-10">12<span className="text-primary">+</span></div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-primary h-full w-[80%] shadow-[0_0_10px_#00D4FF]"></div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-secondary/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-secondary/10 transition-colors duration-500"><Activity size={120} /></div>
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">LEETCODE SOLVED</p>
          <div className="text-6xl font-black text-white relative z-10">100<span className="text-secondary">+</span></div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-secondary h-full w-[60%] shadow-[0_0_10px_#8B5CF6]"></div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-yellow-500/10 transition-colors duration-500"><Trophy size={120} /></div>
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">HACKATHON RANK</p>
          <div className="text-6xl font-black text-white relative z-10 tracking-tighter">Top 3</div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-yellow-500 h-full w-[95%] shadow-[0_0_10px_#EAB308]"></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-blue-500/10 transition-colors duration-500"><Cloud size={120} /></div>
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">CLOUD BADGES</p>
          <div className="text-6xl font-black text-white relative z-10">42</div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-blue-500 h-full w-[100%] shadow-[0_0_10px_#3B82F6]"></div>
          </div>
        </div>
      </div>
      
      {/* ── SAJID.OS Status Panel ── */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/60 border border-primary/30 rounded-2xl p-8 font-mono text-sm backdrop-blur-xl shadow-[0_0_30px_rgba(0,212,255,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
            <span className="text-primary tracking-[0.3em] text-xs uppercase">SAJID.OS // SYSTEM STATUS</span>
          </div>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between"><span className="text-gray-500">STATUS</span><span className="text-green-400 font-bold">ONLINE</span></div>
            <div className="flex justify-between"><span className="text-gray-500">LOCATION</span><span className="text-white">BENGALURU, INDIA</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CGPA</span><span className="text-white">8.5 / 10</span></div>
            <div className="w-full h-px bg-white/10 my-2"></div>
            <div>
              <span className="text-gray-500 block mb-2">CURRENT FOCUS</span>
              <div className="space-y-1">
                {['AI ENGINEERING', 'COMPUTER VISION', 'FULL STACK SYSTEMS', 'CLOUD INFRASTRUCTURE'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs"><span className="text-primary">▸</span><span>{f}</span></div>
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
            <div className="w-full h-px bg-white/10 my-2"></div>
            <div>
              <span className="text-gray-500 block mb-2">AVAILABLE FOR</span>
              <div className="space-y-1">
                {['INTERNSHIPS', 'FREELANCE PROJECTS', 'OPEN SOURCE', 'RESEARCH COLLAB'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs"><span className="text-secondary">▸</span><span>{f}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="pt-12 border-t border-white/10 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
        <span className="flex items-center gap-2 font-black text-2xl tracking-tight text-white hover:text-white transition-colors"><FaUniversity /> JAIN UNIVERSITY</span>
        <span className="flex items-center gap-2 font-bold text-xl tracking-widest uppercase text-white hover:text-blue-400 transition-colors"><SiGooglecloud /> Google Cloud</span>
        <span className="flex items-center gap-2 font-bold text-xl tracking-widest uppercase text-white hover:text-blue-600 transition-colors"><SiCoursera /> Coursera</span>
        <span className="flex items-center gap-2 font-bold text-xl tracking-widest uppercase text-white hover:text-purple-500 transition-colors"><FaBrain /> DeepLearning.AI</span>
        <span className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white hover:text-blue-800 transition-colors">IBM</span>
      </div>
    </section>
  )
}
