import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useStore } from '../../store/useStore'
import { MiniRadar } from '../navigation/MiniRadar'
import { CommandPalette } from '../navigation/CommandPalette'
import { SocialToggle } from '../navigation/SocialToggle'

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isRecruiterMode, toggleRecruiterMode } = useStore()

  // Handle 'R' key press to toggle recruiter mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        toggleRecruiterMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleRecruiterMode])

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${isRecruiterMode ? 'bg-gray-50 text-gray-900' : 'bg-transparent text-white'}`}>
      <CommandPalette />
      <SocialToggle />
      {!isRecruiterMode && <MiniRadar />}
      
      {/* Recruiter Mode Toggle Button */}
      <button 
        onClick={toggleRecruiterMode}
        className={`fixed top-4 right-4 z-50 px-4 py-2 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 rounded-full border backdrop-blur-md ${
          isRecruiterMode 
            ? 'bg-gray-200/80 text-gray-800 border-gray-300 hover:bg-gray-300' 
            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
        }`}
      >
        {isRecruiterMode ? 'Exit Recruiter Mode' : 'Recruiter Mode (R)'}
      </button>

      {children}
    </div>
  )
}
