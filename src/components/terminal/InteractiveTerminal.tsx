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
        <div className="text-primary font-mono mb-4">
          <div>SAJID.OS Terminal v3.0.0</div>
          <div>Type 'help' to see available commands.</div>
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
            <div><span className="text-secondary w-24 inline-block">help</span> Show this help message</div>
            <div><span className="text-secondary w-24 inline-block">whoami</span> Display user profile</div>
            <div><span className="text-secondary w-24 inline-block">skills</span> List core technical skills</div>
            <div><span className="text-secondary w-24 inline-block">projects</span> List featured projects</div>
            <div><span className="text-secondary w-24 inline-block">resume</span> Download/view resume link</div>
            <div><span className="text-secondary w-24 inline-block">achievements</span> View major milestones</div>
            <div><span className="text-secondary w-24 inline-block">contact</span> Display contact information</div>
            <div><span className="text-secondary w-24 inline-block">hackathon</span> Read the VIBEathon story</div>
            <div><span className="text-secondary w-24 inline-block">clear</span> Clear terminal output</div>
          </div>
        )
        break
      case 'whoami':
        output = 'Sajid Ansari - AI Engineer & Full Stack Developer. Building intelligent systems that bridge machine learning and real-world impact. Based in Bengaluru, India.'
        break
      case 'skills':
        output = 'Python, TensorFlow, PyTorch, OpenCV, React, Next.js, Node.js, Express, FastAPI, Docker, Google Cloud.'
        break
      case 'projects':
        output = '1. ConnectAid AI (VIBEathon Top 3)\n2. SmartCart (Automated Retail)\n3. Facial Expression Recognition (Research)'
        break
      case 'resume':
        output = 'Resume can be found in the Resume Center section or downloaded via the top-right button in Recruiter Mode.'
        break
      case 'achievements':
        output = 'Top 3 Hackathon Winner (VIBEathon)\n42 Google Cloud Badges\n100+ LeetCode problems solved\nCGPA: 8.5'
        break
      case 'contact':
        output = 'Email: ansarisajidofficial@gmail.com\nLinkedIn: linkedin.com/in/sajidzaroon\nGitHub: github.com/sajid-da\nLeetCode: leetcode.com/u/W4CqDZs5hX\nCredly: credly.com/users/sajid-ansari.00958aa0\nResponse time: < 24 hours'
        break
      case 'hackathon':
        output = (
          <div className="text-gray-300 italic border-l-2 border-primary pl-4 my-2">
            "We had 36 hours. The problem: emergency responders were losing critical time manually locating facilities during disasters. 
            We built ConnectAid AI using Gemini and React to automate real-time routing. Sleep deprived but fueled by caffeine, 
            we achieved 95% location accuracy and secured a Top 3 finish at VIBEathon. It was a testament to rapid system design."
          </div>
        )
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
    <section className="relative w-full max-w-5xl mx-auto py-24 px-6" id="terminal">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">INTERACTIVE TERMINAL</h2>
        <div className="h-1 w-16 bg-primary"></div>
      </div>

      <div 
        className={`w-full h-96 bg-[#0a0a0a] border ${isFocused ? 'border-primary shadow-[0_0_20px_rgba(0,212,255,0.2)]' : 'border-white/10'} rounded-xl font-mono text-sm overflow-hidden flex flex-col transition-all duration-300 cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-2 select-none">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-gray-500 text-xs tracking-wider">guest@sajid.os: ~</span>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {history.map((entry, idx) => (
            <div key={idx} className="mb-4">
              {entry.command && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">guest@sajid.os:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-white">$</span>
                  <span className="text-gray-200">{entry.command}</span>
                </div>
              )}
              <div className="text-gray-400 whitespace-pre-wrap leading-relaxed">{entry.output}</div>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
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
              className="flex-1 bg-transparent border-none outline-none text-gray-200"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  )
}
