import { useEffect, useState } from 'react'

const sections = ['Hero', 'About', 'Skills', 'Projects', 'Resume', 'Contact']

export const MiniRadar = () => {
  const [activeSection, setActiveSection] = useState('Hero')

  useEffect(() => {
    // This will be replaced with actual scroll observers later
    const handleScroll = () => {
      // Stub implementation
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-5">
      {sections.map((section) => (
        <a 
          key={section} 
          href={`#${section.toLowerCase()}`}
          className="group flex items-center gap-4 justify-end relative cursor-pointer"
          onClick={() => setActiveSection(section)}
        >
          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-500 ${activeSection === section ? 'text-primary opacity-100 mr-2 shadow-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]' : 'text-gray-600 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 group-hover:text-gray-300'}`}>
            {section}
          </span>
          <div className="relative flex items-center justify-center w-5 h-5">
            <div className={`absolute w-full h-full rounded-full transition-all duration-500 ${activeSection === section ? 'bg-primary/20 scale-150 animate-pulse' : 'bg-transparent'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeSection === section ? 'bg-primary scale-125 shadow-[0_0_12px_#00D4FF]' : 'bg-white/20 group-hover:bg-white/60 group-hover:scale-110'}`}></div>
          </div>
        </a>
      ))}
    </div>
  )
}
