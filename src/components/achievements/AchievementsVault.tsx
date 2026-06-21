import { Trophy, Cloud, Award, Activity, GraduationCap } from 'lucide-react'

export const AchievementsVault = () => {
  const achievements = [
    { icon: <Trophy size={48} />, title: "VIBEathon", metric: "Top 3", sub: "/ 1500 Teams", color: "from-yellow-500/20 to-yellow-600/5", border: "hover:border-yellow-500/50", text: "text-yellow-500" },
    { icon: <Cloud size={48} />, title: "Google Cloud", metric: "42", sub: "Skill Badges", color: "from-blue-500/20 to-blue-600/5", border: "hover:border-blue-500/50", text: "text-blue-500" },
    { icon: <Award size={48} />, title: "Credly", metric: "16", sub: "Credentials", color: "from-emerald-500/20 to-emerald-600/5", border: "hover:border-emerald-500/50", text: "text-emerald-500" },
    { icon: <Activity size={48} />, title: "LeetCode", metric: "100+", sub: "Problems Solved", color: "from-orange-500/20 to-orange-600/5", border: "hover:border-orange-500/50", text: "text-orange-500" },
    { icon: <GraduationCap size={48} />, title: "Jain University", metric: "8.5", sub: "CGPA", color: "from-purple-500/20 to-purple-600/5", border: "hover:border-purple-500/50", text: "text-purple-500" },
  ]

  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6" id="achievements">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tighter">ACHIEVEMENTS VAULT</h2>
        <div className="h-1 w-24 bg-primary mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
        {achievements.map((item, idx) => (
          <div key={idx} className={`relative group p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${item.border} ${idx === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}>
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 ${item.text} drop-shadow-[0_0_15px_currentColor] group-hover:scale-110 transition-transform duration-500`}>
                {item.icon}
              </div>
              <h4 className="text-gray-400 font-mono text-sm tracking-widest uppercase mb-2">{item.title}</h4>
              <div className="text-5xl font-black text-white mb-2">{item.metric}</div>
              <div className="text-lg text-gray-500 font-medium">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
