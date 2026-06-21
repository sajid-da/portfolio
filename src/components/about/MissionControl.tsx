import { Activity, Cloud, Code2, Trophy } from 'lucide-react'
import { FaUniversity, FaBrain } from 'react-icons/fa'
import { SiGooglecloud, SiCoursera } from 'react-icons/si'
import { Award } from 'lucide-react'

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
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">FEATURED SYSTEMS</p>
          <div className="text-6xl font-black text-white relative z-10">2</div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-primary h-full w-[100%] shadow-[0_0_10px_#00D4FF]"></div>
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

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
          <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-emerald-500/10 transition-colors duration-500"><Award size={120} /></div>
          <p className="text-gray-400 font-mono text-sm mb-4 tracking-widest relative z-10">CREDENTIALS</p>
          <div className="text-6xl font-black text-white relative z-10">16</div>
          <div className="mt-6 w-full bg-white/10 h-1.5 rounded overflow-hidden relative z-10">
             <div className="bg-emerald-500 h-full w-[100%] shadow-[0_0_10px_#10B981]"></div>
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
