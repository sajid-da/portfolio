import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'

const Core = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.8}>
      <MeshDistortMaterial 
        color="#00D4FF" 
        attach="material" 
        distort={0.5} 
        speed={2} 
        roughness={0.2}
        metalness={0.8}
        emissive="#00D4FF"
        emissiveIntensity={0.4}
      />
    </Sphere>
  )
}

export const ContactCore = () => {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden" id="contact">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Core />
        </Canvas>
      </div>
      
      <div className="z-10 text-center bg-black/40 p-8 md:p-16 rounded-[2rem] backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,212,255,0.05)] w-[90%] max-w-4xl">
        <h2 className="text-4xl md:text-7xl font-black mb-6 text-white tracking-tighter">LET'S BUILD SOMETHING <br/><span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EXTRAORDINARY</span></h2>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 mb-12 font-mono text-gray-300 text-sm">
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            Response time: &lt; 24 hours
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl">📍</span> Based in Bengaluru, India
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <a href="https://wa.me/918123349025" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#25D366]/20 hover:border-[#25D366]/50 hover:text-[#25D366] text-white transition-all duration-300 group shadow-lg">
            <FaWhatsapp size={24} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-wider">WHATSAPP</span>
          </a>
          
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ansarisajidofficial@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] group">
            <SiGmail size={24} className="group-hover:scale-110 transition-transform text-red-500" />
            <span className="font-black tracking-widest">EMAIL</span>
          </a>
          
          <a href="https://www.instagram.com/sajidzaroon/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C] text-white transition-all duration-300 group shadow-lg">
            <FaInstagram size={24} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-wider">INSTAGRAM</span>
          </a>
        </div>
      </div>
    </section>
  )
}
