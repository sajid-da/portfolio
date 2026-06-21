export const ExperienceTimeline = () => {
  const timeline = [
    { year: '2023', title: 'Jain University', desc: 'Started B.Tech in AI & ML' },
    { year: '2024', title: 'Cognito Club Leadership', desc: 'Appointed as Tech Lead' },
    { year: '2025', title: 'VIBEathon Top 3', desc: 'Built ConnectAid AI' },
    { year: '2026', title: 'AI Systems Development', desc: 'Focusing on production-ready AI' },
  ]

  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6 overflow-hidden">
      <div className="mb-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tighter">SYSTEM TIMELINE</h2>
        <div className="h-1 w-16 bg-primary mx-auto"></div>
      </div>

      <div className="relative pt-12 pb-24">
        {/* Metro line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-primary shadow-[0_0_15px_#00D4FF] -translate-y-1/2 rounded-full"></div>
        
        <div className="flex justify-between relative z-10 w-full">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-1/4 group cursor-default">
              <div className={`mb-8 text-sm font-mono tracking-widest ${idx < 2 ? 'text-primary' : 'text-gray-500'}`}>
                {item.year}
              </div>
              <div className={`w-8 h-8 rounded-full bg-bg border-4 relative transition-colors duration-300 z-10 ${idx < 2 ? 'border-primary' : 'border-white/20 group-hover:border-primary'}`}>
                <div className={`absolute inset-0 m-auto rounded-full transition-all duration-300 ${idx < 2 ? 'w-2 h-2 bg-primary shadow-[0_0_10px_#00D4FF]' : 'w-0 h-0 bg-white/50 group-hover:w-2 group-hover:h-2 group-hover:bg-primary'}`}></div>
              </div>
              <div className="mt-8 text-center px-4">
                <div className={`font-bold text-lg mb-2 transition-colors ${idx < 2 ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{item.title}</div>
                <div className="text-sm text-gray-500 hidden md:block">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
