import { useEffect, useState } from 'react'

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 600)
          return 100
        }
        return p + Math.random() * 15
      })
    }, 120)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[999] bg-[#020202] flex flex-col items-center justify-center font-mono p-6">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-black text-white text-center tracking-[0.4em] mb-12">SAJID.OS</h1>
        
        <div>
          <div className="flex justify-between text-xs mb-2 text-primary">
            <span>INITIALIZING SYSTEM...</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-out shadow-[0_0_15px_#00D4FF]" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="h-32 text-xs text-gray-500 space-y-2 mt-8">
          {progress > 10 && <div>&gt; Loading Core Neural Modules... <span className="text-green-500">OK</span></div>}
          {progress > 30 && <div>&gt; Connecting to 3D Rendering Engine... <span className="text-green-500">OK</span></div>}
          {progress > 50 && <div>&gt; Establishing WebGL Context... <span className="text-green-500">OK</span></div>}
          {progress > 70 && <div>&gt; Waking up AI systems... <span className="text-green-500">READY</span></div>}
          {progress > 85 && <div className="text-gray-400">&gt; NOTE: Type 'help' in terminal for commands...</div>}
          {progress >= 100 && <div className="text-primary animate-pulse">&gt; LAUNCH SEQUENCE INITIATED...</div>}
        </div>
      </div>
    </div>
  )
}
