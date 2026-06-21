import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { FaPython, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa'
import { SiTensorflow, SiPytorch, SiFastapi, SiGooglecloud } from 'react-icons/si'
import { X, ExternalLink, Link2 } from 'lucide-react'

interface SkillData {
  label: string
  color: string
  usedIn: string[]
  certifications: string[]
}

const skillsData: Record<string, SkillData> = {
  'Python': { label: 'Python', color: '#3776AB', usedIn: ['SmartCart', 'ConnectAid AI', 'Research Projects'], certifications: [] },
  'TensorFlow': { label: 'TensorFlow', color: '#FF6F00', usedIn: ['SmartCart', 'Facial Expression Recognition'], certifications: ['DeepLearning.AI: Neural Networks and Deep Learning'] },
  'PyTorch': { label: 'PyTorch', color: '#EE4C2C', usedIn: ['Computer Vision Experiments'], certifications: [] },
  'React': { label: 'React', color: '#61DAFB', usedIn: ['ConnectAid AI', 'Portfolio System'], certifications: [] },
  'Node.js': { label: 'Node.js', color: '#339933', usedIn: ['ConnectAid AI', 'SmartCart'], certifications: [] },
  'FastAPI': { label: 'FastAPI', color: '#00A29C', usedIn: ['SmartCart'], certifications: [] },
  'Google Cloud': { label: 'Google Cloud', color: '#4285F4', usedIn: ['Cloud Architecture', 'Vertex AI Deployments'], certifications: ['42 Google Cloud Skill Badges', 'Google Cloud Generative AI'] },
  'Docker': { label: 'Docker', color: '#2496ED', usedIn: ['System Deployments', 'Microservices'], certifications: ['Introduction to DevOps'] },
}

const Planet = ({ position, skillKey, icon: Icon, setActiveSkill }: { position: [number, number, number], skillKey: string, icon: any, setActiveSkill: (k: string) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const data = skillsData[skillKey]
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.2} roughness={0.4} metalness={0.8} />
      
      {/* Hologram Icon on the planet itself */}
      <Html transform distanceFactor={5} position={[0, 0, 0.51]}>
        <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-90 pointer-events-none">
          <Icon size={28} />
        </div>
      </Html>

      <Html distanceFactor={10} position={[0, -0.8, 0]} center zIndexRange={[100, 0]}>
        <div 
          onClick={() => setActiveSkill(skillKey)}
          className="flex items-center gap-2 text-white font-bold text-sm px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 pointer-events-auto cursor-pointer hover:border-current hover:scale-110 transition-all shadow-lg" 
          style={{ color: data.color }}
        >
          <Icon size={18} />
          <span>{data.label}</span>
        </div>
      </Html>
    </mesh>
  )
}

const Galaxy = ({ setActiveSkill }: { setActiveSkill: (k: string) => void }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Node */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} wireframe />
      </mesh>
      
      {/* Orbiting Planets */}
      <Planet position={[3, 0, 0]} skillKey="Python" icon={FaPython} setActiveSkill={setActiveSkill} />
      <Planet position={[-3, 1, 1]} skillKey="TensorFlow" icon={SiTensorflow} setActiveSkill={setActiveSkill} />
      <Planet position={[0, -2, 3]} skillKey="PyTorch" icon={SiPytorch} setActiveSkill={setActiveSkill} />
      <Planet position={[0, 2, -3]} skillKey="React" icon={FaReact} setActiveSkill={setActiveSkill} />
      <Planet position={[2, -1, -2]} skillKey="Node.js" icon={FaNodeJs} setActiveSkill={setActiveSkill} />
      <Planet position={[-2, -1, -2]} skillKey="FastAPI" icon={SiFastapi} setActiveSkill={setActiveSkill} />
      <Planet position={[2, 2, 2]} skillKey="Google Cloud" icon={SiGooglecloud} setActiveSkill={setActiveSkill} />
      <Planet position={[-2, 2, 2]} skillKey="Docker" icon={FaDocker} setActiveSkill={setActiveSkill} />
    </group>
  )
}

export const SkillsGalaxy = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] border-t border-b border-white/10 my-24 bg-[#020202]" id="skills">
      <div className="absolute top-16 left-0 right-0 z-10 text-center pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tighter">SKILLS GALAXY</h2>
        <div className="h-1 w-16 bg-secondary mx-auto"></div>
        <p className="mt-4 text-gray-400 font-mono text-sm uppercase tracking-[0.2em]">Interactive Technology Constellation</p>
      </div>

      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Galaxy setActiveSkill={setActiveSkill} />
      </Canvas>

      {/* Evidence Modal */}
      {activeSkill && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
            style={{ borderTopColor: skillsData[activeSkill].color }}
          >
            <button 
              onClick={() => setActiveSkill(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-3xl font-black text-white mb-6" style={{ color: skillsData[activeSkill].color }}>
              {skillsData[activeSkill].label}
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                  <Link2 size={14} /> Used In
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsData[activeSkill].usedIn.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-gray-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              {skillsData[activeSkill].certifications.length > 0 && (
                <div>
                  <div className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink size={14} /> Related Certifications
                  </div>
                  <div className="flex flex-col gap-2">
                    {skillsData[activeSkill].certifications.map((item, i) => (
                      <span key={i} className="text-sm text-gray-300 border-l-2 pl-3" style={{ borderColor: skillsData[activeSkill].color }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
