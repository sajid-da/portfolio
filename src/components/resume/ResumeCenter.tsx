import { Download, FileText, Briefcase, GraduationCap, Award, Code } from 'lucide-react'

export const ResumeCenter = () => {
  return (
    <div className="w-full h-screen mx-auto py-24 px-6 relative content-scroll overflow-y-auto scrollbar-thin scrollbar-thumb-white/10" id="resume">
      <div className="max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">SAJID ANSARI</h2>
          <p className="text-primary font-mono tracking-[0.2em] text-sm md:text-base">AI ENGINEER & FULL STACK DEVELOPER</p>
        </div>
        <div className="mt-8 md:mt-0 flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-medium text-sm flex">
            <FileText size={16} /> ATS Preview
          </button>
          <button className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(0,212,255,0.3)] text-sm flex">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-16">
          
          <section>
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-4 text-white">
              <Briefcase className="text-primary" size={28} /> Experience
            </h3>
            <div className="space-y-12">
              <div className="relative pl-8 border-l border-white/10 group">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[8.5px] top-1.5 shadow-[0_0_15px_#00D4FF] transition-transform duration-300 group-hover:scale-125"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <h4 className="text-2xl font-bold text-white">Tech Lead</h4>
                  <span className="text-sm font-mono text-gray-500 mt-1 sm:mt-0">2024 - Present</span>
                </div>
                <h5 className="text-xl text-primary/80 mb-4 font-medium">Cognito Club</h5>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Leading a team of developers in building intelligent systems. Orchestrated the architecture for multiple hackathon-winning projects and conducted workshops on AI integrations.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-4 text-white">
              <Code className="text-primary" size={28} /> Featured Systems
            </h3>
            <div className="space-y-12">
              <div className="relative pl-8 border-l border-white/10 group cursor-pointer">
                <div className="absolute w-4 h-4 bg-gray-700 rounded-full -left-[8.5px] top-1.5 transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_15px_#00D4FF]"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">ConnectAid AI</h4>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20 mt-2 sm:mt-0">Top 3 Hackathon</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-lg mt-3 mb-5">
                  Emergency response command center featuring real-time routing and voice analysis. Achieved 95% location accuracy and 90% faster facility discovery.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Gemini API', 'Google Maps API'].map(tech => (
                    <span key={tech} className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="relative pl-8 border-l border-white/10 group cursor-pointer">
                <div className="absolute w-4 h-4 bg-gray-700 rounded-full -left-[8.5px] top-1.5 transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_15px_#00D4FF]"></div>
                <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors mb-2">SmartCart</h4>
                <p className="text-gray-400 leading-relaxed text-lg mt-3 mb-5">
                  Futuristic automated retail store system with live AI product scanning via bounding boxes. Reached 92% recognition accuracy.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['TensorFlow', 'OpenCV', 'FastAPI'].map(tech => (
                    <span key={tech} className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-gray-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-12">
          
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <GraduationCap className="text-primary" /> Education
            </h3>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <h4 className="font-bold text-xl mb-1 text-white">B.Tech AI & ML</h4>
              <p className="text-gray-400 mb-4">Jain University</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
                <span className="text-gray-500 font-medium">CGPA</span>
                <span className="font-mono font-bold text-primary text-2xl drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">8.5</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <Code className="text-primary" /> Core Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'React', 'Node.js', 'Google Cloud', 'Docker'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <Award className="text-primary" /> Achievements
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Google Cloud Badges', value: '42' },
                { label: 'LeetCode Solved', value: '100+' },
                { label: 'Credly Credentials', value: '16' }
              ].map(stat => (
                <li key={stat.label} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <span className="text-sm font-medium text-gray-300">{stat.label}</span>
                  <span className="font-mono font-bold text-primary text-lg">{stat.value}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
        </div>
      </div>
    </div>
  )
}
