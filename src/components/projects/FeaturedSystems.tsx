import { useState } from 'react'
import { ExternalLink, ChevronRight, X, Activity, Server, Database, Brain } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const caseStudies = {
  'connectaid': {
    title: 'ConnectAid AI',
    problem: 'During natural disasters, emergency responders lose critical time manually locating facilities and routing vehicles through blocked paths.',
    constraints: 'Built entirely within a 36-hour hackathon timeframe. Required real-time data processing and a highly intuitive interface for high-stress situations.',
    architecture: [
      { node: 'User Interface', desc: 'React Dashboard', icon: <Activity size={20} /> },
      { node: 'API Gateway', desc: 'Node.js Express', icon: <Server size={20} /> },
      { node: 'Intelligence', desc: 'Gemini Voice Analysis', icon: <Brain size={20} /> },
      { node: 'Data', desc: 'Real-time routing DB', icon: <Database size={20} /> },
    ],
    result: 'Achieved 95% location accuracy and 90% faster facility discovery, securing a Top 3 finish at VIBEathon.',
  }
}

export const FeaturedSystems = () => {
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null)

  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6" id="projects">
      <div className="mb-20">
        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">FEATURED SYSTEMS</h2>
        <div className="h-1 w-24 bg-primary"></div>
      </div>

      <div className="space-y-32">
        {/* Project 1 */}
        <div className="group relative flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">ConnectAid AI</h3>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              An intelligent emergency response command center. It features real-time dynamic routing and AI-driven voice analysis to drastically reduce response times during crises.
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
                Behind the Build
                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-4">
                <a href="https://github.com/Pranshu-Dev01/ConnectAid" target="_blank" rel="noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"><FaGithub size={20} /></a>
                <a href="#" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors"><ExternalLink size={20} /></a>
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
              A futuristic automated retail store system utilizing live AI product scanning via bounding boxes, eliminating the need for traditional checkouts.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">TensorFlow</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">OpenCV</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-sm text-secondary">FastAPI</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <button className="group/btn flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                Behind the Build
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
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
            <button 
              onClick={() => setActiveCaseStudy(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-16">
              <h4 className="text-primary font-mono tracking-widest text-sm mb-4">BEHIND THE BUILD</h4>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-16">{caseStudies[activeCaseStudy as keyof typeof caseStudies].title}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div>
                  <div className="mb-12">
                    <h5 className="text-2xl font-bold text-white mb-4">Problem</h5>
                    <p className="text-gray-400 leading-relaxed text-lg">{caseStudies[activeCaseStudy as keyof typeof caseStudies].problem}</p>
                  </div>
                  
                  <div className="mb-12">
                    <h5 className="text-2xl font-bold text-white mb-4">Constraints</h5>
                    <p className="text-gray-400 leading-relaxed text-lg">{caseStudies[activeCaseStudy as keyof typeof caseStudies].constraints}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-2xl font-bold text-white mb-4">Result</h5>
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-primary font-medium text-lg">{caseStudies[activeCaseStudy as keyof typeof caseStudies].result}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-2xl font-bold text-white mb-8">Architecture</h5>
                  <div className="space-y-4">
                    {caseStudies[activeCaseStudy as keyof typeof caseStudies].architecture.map((item, idx) => (
                      <div key={idx} className="group relative flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-colors">
                        <div className="w-12 h-12 bg-black rounded-lg border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,212,255,0)] group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-bold text-white text-lg">{item.node}</div>
                          <div className="text-gray-500 font-mono text-sm">{item.desc}</div>
                        </div>
                        {idx !== caseStudies[activeCaseStudy as keyof typeof caseStudies].architecture.length - 1 && (
                          <div className="absolute left-[39px] bottom-[-20px] w-0.5 h-4 bg-white/10"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
