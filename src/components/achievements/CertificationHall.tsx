import { useState } from 'react'
import { ChevronDown, Code2, Cloud, Database, Activity } from 'lucide-react'

const categories = [
  {
    id: 'ai',
    title: 'Artificial Intelligence & ML',
    icon: <Activity size={24} />,
    color: 'text-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/5',
    certs: [
      'DeepLearning.AI: Neural Networks and Deep Learning',
      'Probability & Statistics For Machine Learning',
      'Introduction To Computer Vision',
      'Reinforcement Learning (In Progress)'
    ]
  },
  {
    id: 'cloud',
    title: 'Cloud Engineering',
    icon: <Cloud size={24} />,
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/5',
    certs: [
      '42 Google Cloud Skill Badges',
      'Google Cloud Generative AI',
      'Google Cloud Computing Foundations'
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Architecture',
    icon: <Database size={24} />,
    color: 'text-secondary',
    border: 'border-secondary/30',
    bg: 'bg-secondary/5',
    certs: [
      'Introduction To DevOps',
      'Terraform Foundations',
      'Docker & Containerization'
    ]
  },
  {
    id: 'data',
    title: 'Data Systems',
    icon: <Code2 size={24} />,
    color: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/5',
    certs: [
      'BigQuery Fundamentals',
      'Data Analytics with Python'
    ]
  }
]

export const CertificationHall = () => {
  const [openId, setOpenId] = useState<string | null>('ai')

  return (
    <section className="relative w-full max-w-5xl mx-auto py-24 px-6" id="certifications">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tighter">CERTIFICATION HALL</h2>
        <div className="h-1 w-24 bg-white/20 mx-auto"></div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openId === cat.id ? `${cat.border} ${cat.bg}` : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
            <button 
              onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl border border-white/10 bg-black ${openId === cat.id ? cat.color : 'text-gray-500'}`}>
                  {cat.icon}
                </div>
                <h3 className={`text-xl md:text-2xl font-bold ${openId === cat.id ? 'text-white' : 'text-gray-400'}`}>
                  {cat.title}
                </h3>
              </div>
              <ChevronDown 
                size={24} 
                className={`text-gray-500 transition-transform duration-300 ${openId === cat.id ? 'rotate-180 text-white' : ''}`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === cat.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="p-6 md:p-8 pt-0 border-t border-white/5">
                <ul className="space-y-4">
                  {cat.certs.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className={`mt-2 w-1.5 h-1.5 rounded-full ${cat.color} shrink-0`}></div>
                      <span className="text-gray-300 text-lg">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
