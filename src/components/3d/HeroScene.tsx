import { InteractiveTerminal } from '../terminal/InteractiveTerminal'

export const HeroScene = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6 pt-20" id="hero">
      <div className="w-full max-w-5xl flex flex-col items-start gap-6 mb-12">
        <div>
          <div className="text-white font-black tracking-widest text-3xl md:text-5xl mb-2">SAJID.OS <span className="text-gray-500 font-normal">v3.0</span></div>
          <div className="text-primary font-mono flex items-center gap-2 md:text-lg mb-8">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00D4FF]"></span>
            &gt; boot sequence complete
          </div>
        </div>
        
        <div className="flex flex-col gap-2 border-l-2 border-primary/30 pl-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Sajid Ansari</h1>
          <div className="text-xl md:text-2xl text-gray-400 font-mono">
            <span className="text-primary">AI Engineer</span> <span className="opacity-50">|</span> Full Stack Developer <span className="opacity-50">|</span> System Builder
          </div>
          <p className="text-gray-500 mt-2 max-w-xl">Building AI-Powered Systems From Concept To Deployment.</p>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mb-8">
        <InteractiveTerminal />
      </div>
    </div>
  )
}
