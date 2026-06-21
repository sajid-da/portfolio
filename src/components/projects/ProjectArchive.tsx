import { ExternalLink, Code2, FlaskConical, BookOpen } from 'lucide-react'

export const ProjectArchive = () => {
  const archive = [
    {
      title: 'Facial Expression Recognition',
      type: 'Research',
      icon: <BookOpen size={20} className="text-secondary" />,
      desc: 'Real-time emotion classification using deep convolutional neural networks. Achieved 88% accuracy on the FER2013 dataset.',
      tech: ['PyTorch', 'OpenCV', 'Python'],
      github: '#'
    },
    {
      title: 'Portfolio v2',
      type: 'Experiment',
      icon: <FlaskConical size={20} className="text-primary" />,
      desc: 'Previous iteration of personal portfolio exploring WebGL and Three.js physics interactions.',
      tech: ['Three.js', 'React', 'GSAP'],
      github: '#'
    },
    {
      title: 'ML Traffic Prediction',
      type: 'Experiment',
      icon: <FlaskConical size={20} className="text-primary" />,
      desc: 'Time-series forecasting model to predict urban traffic congestion patterns based on weather and historical data.',
      tech: ['Scikit-Learn', 'Pandas', 'XGBoost'],
      github: '#'
    }
  ]

  return (
    <section className="relative w-full max-w-7xl mx-auto py-24 px-6">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">PROJECT ARCHIVE</h2>
          <div className="h-1 w-16 bg-white/20"></div>
        </div>
        <a href="#" className="flex items-center gap-2 text-primary hover:text-white transition-colors font-mono text-sm">
          VIEW ALL REPOSITORIES <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archive.map((project, idx) => (
          <div key={idx} className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-black/50 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                {project.icon}
              </div>
              <div className="flex gap-3">
                <a href={project.github} className="text-gray-400 hover:text-white transition-colors"><Code2 size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><ExternalLink size={18} /></a>
              </div>
            </div>
            
            <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">{project.type}</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
              {project.desc}
            </p>
            
            <div className="flex flex-wrap gap-x-3 gap-y-2 mt-auto pt-6 border-t border-white/5">
              {project.tech.map(tech => (
                <span key={tech} className="text-xs font-mono text-gray-500">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
