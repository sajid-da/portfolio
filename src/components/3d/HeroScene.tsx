import { InteractiveTerminal } from '../terminal/InteractiveTerminal'

export const HeroScene = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6 pt-20" id="hero">
      <div className="w-full max-w-5xl mb-8">
        <InteractiveTerminal />
      </div>
      
      {/* Hero Subtitle */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-end gap-6 border-t border-white/10 pt-6 font-mono text-sm">
        <div>
          <div className="text-white font-bold tracking-widest text-lg mb-1">SAJID.OS v3.0</div>
          <div className="text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            &gt; boot sequence complete
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-gray-400">
          <div className="flex flex-col gap-1">
            <span className="text-white">AI Engineer</span>
            <span>Full Stack Developer</span>
            <span>System Builder</span>
          </div>
          <div className="flex flex-col gap-1 md:text-right">
            <span className="text-white tracking-wide">Building AI-Powered Systems</span>
            <span>From Concept To Deployment</span>
          </div>
        </div>
      </div>
    </div>
  )
}
