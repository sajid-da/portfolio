import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

export const TerminalPanel = () => {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string; color?: string }[]>([
    { type: 'output', text: 'SAJID.OS TERMINAL v3.0' },
    { type: 'output', text: 'Type "help" for a list of available commands.', color: 'text-gray-400' }
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newHistory = [...history, { type: 'input' as const, text: cmd }]

    switch (trimmed) {
      case 'help':
        newHistory.push(
          { type: 'output', text: 'Available commands:', color: 'text-primary' },
          { type: 'output', text: '  about      - Display system architecture (about me)' },
          { type: 'output', text: '  skills     - List neural modules (skills)' },
          { type: 'output', text: '  projects   - Execute project matrix (portfolio)' },
          { type: 'output', text: '  contact    - Establish comm link (contact info)' },
          { type: 'output', text: '  clear      - Clear terminal output' },
          { type: 'output', text: '  sudo       - Elevate privileges' }
        )
        break
      case 'about':
        newHistory.push({ type: 'output', text: 'SAJID ANSARI: AI Engineer & Full-Stack Developer building intelligent systems.', color: 'text-green-400' })
        break
      case 'skills':
        newHistory.push({ type: 'output', text: 'Modules: Python, React, TensorFlow, Node.js, Cloud Infrastructure...', color: 'text-blue-400' })
        break
      case 'projects':
        newHistory.push({ type: 'output', text: 'Accessing matrix... Scroll to PROJECTS section for full data.', color: 'text-purple-400' })
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'contact':
        newHistory.push({ type: 'output', text: 'Comm link active. Email: ansarisajidofficial@gmail.com | Phone: +91 8123349025', color: 'text-yellow-400' })
        break
      case 'clear':
        setHistory([])
        setInput('')
        return
      case 'sudo':
        newHistory.push({ type: 'output', text: 'Access Denied. This incident will be reported.', color: 'text-red-500' })
        break
      case '':
        break
      default:
        newHistory.push({ type: 'output', text: `Command not found: ${cmd}`, color: 'text-red-400' })
    }

    setHistory(newHistory)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    }
  }

  return (
    <div className="w-full bg-black/60 border border-primary/30 rounded-2xl p-6 font-mono text-sm backdrop-blur-xl shadow-[0_0_30px_rgba(0,212,255,0.05)] h-64 flex flex-col" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
        <span className="text-primary tracking-[0.3em] text-xs uppercase">INTERACTIVE TERMINAL</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 text-gray-300 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {history.map((line, i) => (
          <div key={i} className="flex">
            {line.type === 'input' ? (
              <span className="text-gray-500 mr-2">guest@sajid.os:~$</span>
            ) : null}
            <span className={line.color || 'text-gray-300'}>{line.text}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">guest@sajid.os:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white caret-primary"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
