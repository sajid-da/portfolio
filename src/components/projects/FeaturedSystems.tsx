import { useState } from 'react'
import { ChevronRight, X, ArrowDown } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const caseStudies = {
  'connectaid': {
    title: 'ConnectAid AI',
    overview: 'AI-powered emergency assistance platform developed during VIBEathon.',
    problem: 'Emergency situations often require rapid identification of nearby facilities and support resources, but responders lose critical time manually locating them.',
    constraints: 'Built entirely within a 36-hour hackathon timeframe. Required real-time data processing and a highly intuitive interface for high-stress situations.',
    architecture: ['User', 'React Frontend', 'Node.js Backend', 'Gemini AI', 'Maps API', 'Results'],
    implementation: 'Leveraged Gemini for NLP voice analysis to extract emergency contexts, paired with Google Maps API for dynamic real-time routing. The frontend was built with React for instant feedback.',
    challenges: 'Integrating voice-to-text in a noisy environment and ensuring the routing algorithm could handle rapid re-calculations without crashing the Node.js server.',
    result: 'Achieved 95% location accuracy and 90% faster facility discovery, securing a Top 3 finish among 1500 teams.',
    lessons: 'Rapid system design requires rigid scoping. Relying on managed AI APIs (like Gemini) drastically accelerated our time-to-MVP compared to training custom models.',
    link: 'https://github.com/Pranshu-Dev01/ConnectAid',
    theme: 'primary'
  },
  'smartcart': {
    title: 'SmartCart',
    overview: 'AI-powered automated checkout and inventory management system.',
    problem: 'Traditional checkout systems increase wait times and reduce inventory visibility in retail environments.',
    constraints: 'Must operate in real-time on edge devices with limited computing power while maintaining high accuracy.',
    architecture: ['Camera', 'OpenCV', 'TensorFlow Model', 'FastAPI', 'Checkout Engine'],
    implementation: 'Trained a custom object detection model using TensorFlow, deployed via a lightweight FastAPI backend. OpenCV handled the live camera feed and bounding box generation.',
    challenges: 'Model inference speed was initially too slow for live video. We had to optimize the TensorFlow model via quantization to achieve a stable FPS on edge hardware.',
    result: '92% Recognition Accuracy, 40% Faster Checkout, and a 96/100 Academic Evaluation. Research paper submitted based on findings.',
    lessons: 'Hardware constraints dictate software architecture. Edge computing requires hyper-optimized models, and Python/FastAPI is incredibly effective for serving ML inference.',
    link: 'https://github.com/sajid-da/project-cart-',
    theme: 'secondary'
  }
}

const ArchitectureFlow = ({ nodes, theme }: { nodes: string[], theme: string }) => {
  const color = theme === 'primary' ? 'text-primary border-primary/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'text-secondary border-secondary/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
  const arrowColor = theme === 'primary' ? 'text-primary/50' : 'text-secondary/50'

  return (
    <div className="flex flex-col items-center py-8">
      {nodes.map((node, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className={`px-6 py-3 border rounded-xl font-bold bg-black/50 backdrop-blur-md ${color} animate-in fade-in slide-in-from-top-4`} style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}>
            {node}
          </div>
          {idx < nodes.length - 1 && (
            <div className={`my-3 animate-bounce ${arrowColor}`}>
              <ArrowDown size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const FeaturedSystems = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null)

  return (
    <div className="w-full h-screen mx-auto py-24 px-6 relative content-scroll overflow-y-auto scrollbar-thin scrollbar-thumb-white/10" id="projects">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">FEATURED SYSTEMS</h2>
        <div className="h-1 w-24 bg-primary"></div>
      </div>

      <div className="space-y-32">
        {/* Project 1 */}
        <div className="group relative flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">ConnectAid AI</h3>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              AI-powered emergency assistance platform developed during VIBEathon.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-primary">React</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-primary">Node.js</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-primary">Gemini API</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <button 
                onClick={() => setActiveCaseStudy('connectaid')}
                className="group/btn flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                Case Study
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-4">
                <a href="https://github.com/Pranshu-Dev01/ConnectAid" target="_blank" rel="noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"><FaGithub size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 aspect-video bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden group-hover:border-primary/30 transition-colors duration-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            <div className="w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
               <div className="w-24 h-24 rounded-full border border-primary/50 border-dashed"></div>
            </div>
            <div className="absolute text-primary/50 font-mono text-xs bottom-4 right-4">SYSTEM.RENDER()</div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="group relative flex flex-col lg:flex-row-reverse gap-12 items-center">
          <div className="w-full lg:w-1/2 relative z-10 lg:pl-12">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">SmartCart</h3>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              AI-powered automated checkout and inventory management system using computer vision.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">TensorFlow</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">OpenCV</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">FastAPI</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <button 
                onClick={() => setActiveCaseStudy('smartcart')}
                className="group/btn flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                Case Study
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-4">
                <a href="https://github.com/sajid-da/project-cart-" target="_blank" rel="noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"><FaGithub size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 aspect-video bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden group-hover:border-secondary/30 transition-colors duration-500 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary/10 to-transparent"></div>
            <div className="w-40 h-24 border-2 border-secondary/40 relative">
               <div className="absolute top-0 left-0 w-2 h-2 bg-secondary -translate-x-1 -translate-y-1"></div>
               <div className="absolute top-0 right-0 w-2 h-2 bg-secondary translate-x-1 -translate-y-1"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 bg-secondary -translate-x-1 translate-y-1"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-secondary translate-x-1 translate-y-1"></div>
            </div>
            <div className="absolute text-secondary/50 font-mono text-xs bottom-4 left-4">VISION.DETECT()</div>
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      {activeCaseStudy && caseStudies[activeCaseStudy as keyof typeof caseStudies] && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#050505] md:border border-white/10 w-full max-w-6xl h-full md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="border-b border-white/10 p-6 md:p-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-20">
              <div>
                <h4 className="text-gray-500 font-mono tracking-widest text-xs mb-2 uppercase">Systems Case Study</h4>
                <h2 className={`text-2xl md:text-4xl font-black ${caseStudies[activeCaseStudy as keyof typeof caseStudies].theme === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                  {caseStudies[activeCaseStudy as keyof typeof caseStudies].title}
                </h2>
              </div>
              <div className="flex gap-4">
                <a href={caseStudies[activeCaseStudy as keyof typeof caseStudies].link} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                  <FaGithub size={16} /> Repository
                </a>
                <button 
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-5xl mx-auto">
                
                {/* Left Column: Text Data */}
                <div className="lg:col-span-8 space-y-12">
                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">Overview</h5>
                    <p className="text-white text-xl leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].overview}</p>
                  </section>
                  
                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">The Problem</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].problem}</p>
                  </section>

                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">Constraints</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].constraints}</p>
                  </section>

                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">Implementation</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].implementation}</p>
                  </section>

                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">Challenges</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].challenges}</p>
                  </section>

                  <section>
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 border-b border-white/10 pb-2 uppercase">Lessons Learned</h5>
                    <p className="text-gray-300 text-lg leading-relaxed">{caseStudies[activeCaseStudy as keyof typeof caseStudies].lessons}</p>
                  </section>
                </div>
                
                {/* Right Column: Architecture & Results */}
                <div className="lg:col-span-4 space-y-12">
                  <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-6 uppercase text-center">Architecture Flow</h5>
                    <ArchitectureFlow 
                      nodes={caseStudies[activeCaseStudy as keyof typeof caseStudies].architecture} 
                      theme={caseStudies[activeCaseStudy as keyof typeof caseStudies].theme} 
                    />
                  </section>

                  <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h5 className="text-sm font-mono text-gray-500 tracking-widest mb-4 uppercase">Key Results</h5>
                    <div className={`p-4 rounded-xl border font-bold text-lg leading-relaxed ${caseStudies[activeCaseStudy as keyof typeof caseStudies].theme === 'primary' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/10 border-secondary/30 text-secondary'}`}>
                      {caseStudies[activeCaseStudy as keyof typeof caseStudies].result}
                    </div>
                  </section>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
