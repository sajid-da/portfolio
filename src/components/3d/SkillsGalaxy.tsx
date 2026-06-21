import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const Planet = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.4} metalness={0.8} />
      <Html distanceFactor={10} position={[0, -0.8, 0]} center zIndexRange={[100, 0]}>
        <div className="text-white font-mono text-xs whitespace-nowrap px-3 py-1.5 bg-black/70 backdrop-blur-md rounded border border-white/20 pointer-events-auto cursor-pointer hover:border-primary hover:text-primary transition-colors">
          {label}
        </div>
      </Html>
    </mesh>
  )
}

const Galaxy = () => {
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
      <Planet position={[3, 0, 0]} color="#3776AB" label="Python" />
      <Planet position={[-3, 1, 1]} color="#FF6F00" label="TensorFlow" />
      <Planet position={[0, -2, 3]} color="#EE4C2C" label="PyTorch" />
      <Planet position={[0, 2, -3]} color="#61DAFB" label="React" />
      <Planet position={[2, -1, -2]} color="#339933" label="Node.js" />
      <Planet position={[-2, -1, -2]} color="#00A29C" label="FastAPI" />
      <Planet position={[2, 2, 2]} color="#4285F4" label="Google Cloud" />
      <Planet position={[-2, 2, 2]} color="#2496ED" label="Docker" />
    </group>
  )
}

export const SkillsGalaxy = () => {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] border-t border-b border-white/10 my-24 bg-[#020202]" id="skills">
      <div className="absolute top-16 left-0 right-0 z-10 text-center pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tighter">SKILLS GALAXY</h2>
        <div className="h-1 w-16 bg-secondary mx-auto"></div>
        <p className="mt-4 text-gray-400 font-mono text-sm uppercase tracking-[0.2em]">Interactive Technology Constellation</p>
      </div>

      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Galaxy />
      </Canvas>
    </section>
  )
}
