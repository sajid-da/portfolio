import { InteractiveTerminal } from '../terminal/InteractiveTerminal'

export const HeroScene = () => {
  return (
    <div className="relative min-h-screen flex flex-col xl:flex-row items-center justify-center z-10 px-4 md:px-8 py-12 gap-12 max-w-7xl mx-auto" id="hero">
      
      {/* Text Content - Below terminal on mobile, Left on desktop */}
      <div className="w-full max-w-xl flex flex-col items-start gap-6 order-2 xl:order-1">
        <div>
          <div className="text-white font-black tracking-widest text-3xl md:text-5xl mb-2">SAJID.OS <span className="text-gray-500 font-normal">v3.0</span></div>
          <div className="text-primary font-mono flex items-center gap-2 text-sm md:text-base mb-4 md:mb-8">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00D4FF]"></span>
            &gt; system online
          </div>
        </div>
        
        <div className="flex flex-col gap-2 border-l-2 border-primary/30 pl-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Sajid Ansari</h1>
          <div className="text-lg md:text-2xl text-gray-400 font-mono">
            <span className="text-primary">AI Engineer</span> <span className="opacity-50">|</span> Full Stack Developer
          </div>
          <p className="text-gray-500 mt-2 max-w-xl text-sm md:text-base">Building AI-Powered Systems From Concept To Deployment.</p>
        </div>
      </div>
      
      {/* Terminal - Top on mobile, Right on desktop -> Lands exactly on command prompt */}
      <div className="w-full max-w-2xl flex-shrink-0 order-1 xl:order-2 mt-8 xl:mt-0">
        <InteractiveTerminal />
      </div>
      
    </div>
  )
}
