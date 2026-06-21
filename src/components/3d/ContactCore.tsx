import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

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
        <Canvas camera={{ position: [0, 0, 5] }}>
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

        <div className="flex flex-wrap justify-center gap-6">
          <a href="mailto:sajid.ansari@example.com" className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-widest uppercase text-sm">
            INITIALIZE CONTACT
          </a>
        </div>
      </div>
    </section>
  )
}
