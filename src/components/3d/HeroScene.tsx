import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Particles = () => {
  const count = 600
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix)
      }
    })
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} />
    </instancedMesh>
  )
}

export const HeroScene = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-center z-10 px-6" id="hero">
      <div className="absolute inset-0 -z-10">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 75 }}>
          <fog attach="fog" args={['#050505', 10, 50]} />
          <Particles />
        </Canvas>
      </div>
      
      <div className="pointer-events-none">
        <h2 className="text-primary tracking-[0.3em] text-xs md:text-sm mb-4 font-mono">SAJID.OS // VERSION 3.0</h2>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
          Sajid Ansari
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
          Designing intelligent systems that bridge machine learning and real-world impact.
        </p>
        
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-center pointer-events-auto">
          <span className="flex items-center gap-2 text-xs font-mono bg-black/40 px-5 py-2.5 rounded-full border border-white/10 text-gray-300 backdrop-blur-xl hover:border-primary/50 transition-colors">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00D4FF]"></span>
            System Status: Online
          </span>
          <span className="flex items-center gap-2 text-xs font-mono bg-black/40 px-5 py-2.5 rounded-full border border-white/10 text-gray-300 backdrop-blur-xl hover:border-primary/50 transition-colors">
            Current Mission: Building Intelligent Systems
          </span>
        </div>
      </div>
    </div>
  )
}
