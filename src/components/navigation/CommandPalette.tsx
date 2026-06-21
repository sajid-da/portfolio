import { useEffect, useState } from 'react'
import { Terminal, Search, Folder, User, Mail, Code2, Briefcase, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

const commands = [
  { id: 'projects', name: 'Go to Projects', icon: <Folder size={16} /> },
  { id: 'resume', name: 'Open Resume', icon: <User size={16} /> },
  { id: 'contact', name: 'Contact Me', icon: <Mail size={16} /> },
  { id: 'github', name: 'GitHub Profile', icon: <Code2 size={16} /> },
  { id: 'linkedin', name: 'LinkedIn Profile', icon: <Briefcase size={16} /> },
  { id: 'terminal', name: 'Open Terminal', icon: <Terminal size={16} /> },
]

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { toggleRecruiterMode } = useStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  const filteredCommands = commands.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search size={20} className="text-gray-500" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            className="bg-transparent border-none outline-none text-white w-full font-sans text-lg placeholder:text-gray-600 focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <ul className="space-y-1">
              {filteredCommands.map((command) => (
                <li key={command.id}>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors group"
                    onClick={() => {
                      console.log('Execute', command.id);
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-gray-500 group-hover:text-primary transition-colors">{command.icon}</span>
                    <span className="font-medium">{command.name}</span>
                  </button>
                </li>
              ))}
              
              <div className="h-px bg-white/5 my-2 mx-4"></div>
              
              <li>
                 <button 
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    onClick={() => {
                      toggleRecruiterMode();
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-primary"><User size={16} /></span>
                    <span className="font-bold">Toggle Recruiter Mode</span>
                    <span className="ml-auto text-[10px] font-mono bg-primary/20 px-2 py-0.5 rounded border border-primary/30 text-primary">R</span>
                  </button>
              </li>
            </ul>
          ) : (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              No commands found for "{query}"
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-white/5 bg-[#050505] flex items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400">ESC</span> to close</span>
          <span className="flex items-center gap-1"><span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400">↑↓</span> to navigate</span>
          <span className="flex items-center gap-1"><span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400">ENTER</span> to select</span>
        </div>
      </div>
    </div>
  )
}
