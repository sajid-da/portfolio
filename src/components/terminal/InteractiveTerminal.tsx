import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

interface CommandOutput {
  command: string
  output: string | ReactNode
}

export const InteractiveTerminal = () => {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: '',
      output: (
        <div className="text-primary font-mono mb-4 md:text-lg">
          <div className="text-green-400">System Online. Type 'help' to see available commands.</div>
        </div>
      )
    }
  ])
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    let output: string | ReactNode = ''

    if (trimmed === '') return

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 my-2">
            <div><span className="text-secondary w-32 inline-block">help</span> Show this help message</div>
            <div><span className="text-secondary w-32 inline-block">whoami</span> Display user profile</div>
            <div><span className="text-secondary w-32 inline-block">skills</span> List core technical skills</div>
            <div><span className="text-secondary w-32 inline-block">projects</span> List featured projects</div>
            <div><span className="text-secondary w-32 inline-block">resume</span> Download/view resume link</div>
            <div><span className="text-secondary w-32 inline-block">achievements</span> View major milestones</div>
            <div><span className="text-secondary w-32 inline-block">contact</span> Display contact information</div>
            <div><span className="text-secondary w-32 inline-block">hackathon</span> Read the VIBEathon story</div>
            <div><span className="text-secondary w-32 inline-block">clear</span> Clear terminal output</div>
          </div>
        )
        break
      case 'whoami':
        output = 'Sajid Ansari\nAI & ML Engineer\nJain University\nCGPA 8.5'
        break
      case 'skills':
        output = 'AI & Machine Learning\nBackend Development\nFrontend Development\nCloud Engineering\nComputer Vision'
        break
      case 'projects':
        output = 'ConnectAid AI\nSmartCart\nFacial Expression Recognition\nResearch Projects'
        break
      case 'resume':
        output = (
          <div>
            Resume available. <a href="/Sajid_Ansari_Resume.pdf" target="_blank" rel="noreferrer" className="text-primary underline hover:text-white transition-colors">Click here to download (PDF)</a>.
          </div>
        )
        break
      case 'achievements':
        output = 'Top 3 Hackathon Winner (VIBEathon)\n42 Google Cloud Badges\n100+ LeetCode problems solved\nCGPA: 8.5'
        break
      case 'contact':
        output = 'Email\nGitHub\nLinkedIn\nLeetCode'
        break
      case 'hackathon':
        output = 'VIBEathon\n\nTop 3 Team\n\n1500 Teams\n\n20000+ Participants\n\nProject:\nConnectAid AI'
        break
      case 'clear':
        setHistory([])
        setInput('')
        return
      default:
        output = <span className="text-red-400">Command not found: {trimmed}. Type 'help' for available commands.</span>
    }

    setHistory((prev) => [...prev, { command: trimmed, output }])
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    }
  }

  return (
    <div 
      className={`w-full h-[65vh] md:h-[70vh] bg-[#050505]/80 backdrop-blur-md border ${isFocused ? 'border-primary shadow-[0_0_30px_rgba(0,212,255,0.2)]' : 'border-white/10'} rounded-2xl font-mono text-sm md:text-base overflow-hidden flex flex-col transition-all duration-300 cursor-text shadow-2xl relative z-20`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-2 select-none">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
        <span className="ml-4 text-gray-500 text-xs md:text-sm tracking-wider">guest@sajid.os: ~</span>
        <div className="ml-auto text-xs text-gray-600 font-sans tracking-widest uppercase">Terminal v3.0</div>
      </div>
      
      <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {history.map((entry, idx) => (
          <div key={idx} className="mb-6">
            {entry.command && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">guest@sajid.os:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$</span>
                <span className="text-gray-200">{entry.command}</span>
              </div>
            )}
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{entry.output}</div>
          </div>
        ))}
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-green-400">guest@sajid.os:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$</span>
          <input 
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 caret-primary"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </div>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  )
}
