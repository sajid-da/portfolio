export const AboutCore = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6" id="about-core">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-12 bg-primary"></div>
            <h2 className="text-xl md:text-2xl font-mono tracking-[0.2em] text-white uppercase">Identity Protocol</h2>
          </div>
          
          <div className="space-y-8 text-xl md:text-3xl font-medium text-gray-300 leading-relaxed md:leading-snug tracking-tight">
            <p>
              I'm <span className="text-white font-bold">Sajid Ansari</span>, an AI & ML student at Jain University focused on building intelligent systems that combine machine learning, software engineering, and real-world impact.
            </p>
            <p>
              My work spans <span className="text-primary hover:text-white transition-colors duration-300">AI-powered applications</span>, <span className="text-secondary hover:text-white transition-colors duration-300">computer vision systems</span>, backend architecture, cloud technologies, and full-stack development.
            </p>
            <p className="text-lg md:text-2xl text-gray-400">
              I enjoy transforming ideas into working products through rapid experimentation, system design, and practical engineering.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
