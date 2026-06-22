import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useScene } from './SceneManager'

// --- SCENE EFFECTS ---

// Scene 5: Skills Galaxy
const SkillsGalaxyEffect = ({ active }: { active: boolean }) => {
  const ref = useRef<THREE.Points>(null!)
  const [positions] = useState(() => {
    const pos = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const r = 20 * Math.random()
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  })

  const materialRef = useRef<THREE.PointsMaterial>(null!)

  useFrame((_state, delta) => {
    if (!ref.current || !materialRef.current) return
    ref.current.rotation.y -= delta * 0.05
    ref.current.rotation.x -= delta * 0.02
    
    // Dissolve in/out based on active state
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      active ? 0.6 : 0,
      0.05
    )
    materialRef.current.transparent = true;
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#00D4FF"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0}
      />
    </Points>
  )
}

// Scene 6 & 7: ConnectAid / SmartCart abstract geometric fragments
const GeometricFragmentsEffect = ({ active }: { active: boolean }) => {
  const groupRef = useRef<THREE.Group>(null!)
  const [fragments] = useState(() => {
    return Array.from({ length: 50 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 10
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1
    }))
  })

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += delta * 0.05
    
    // Scale the entire group based on active state to simulate collapsing/expanding
    const targetScale = active ? 1 : 0.001
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05)
  })

  return (
    <group ref={groupRef}>
      {fragments.map((frag, i) => (
        <mesh key={i} position={frag.position} rotation={frag.rotation} scale={frag.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={active ? 0.3 : 0} />
        </mesh>
      ))}
    </group>
  )
}

// Scene 9: Achievements (Glowing Gold Particles)
const AchievementParticlesEffect = ({ active }: { active: boolean }) => {
  const ref = useRef<THREE.Points>(null!)
  const [positions] = useState(() => {
    const pos = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  })

  const materialRef = useRef<THREE.PointsMaterial>(null!)

  useFrame((_state, delta) => {
    if (!ref.current || !materialRef.current) return
    ref.current.position.y += delta * 2
    if (ref.current.position.y > 15) ref.current.position.y = -15
    
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      active ? 0.8 : 0,
      0.05
    )
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={materialRef}
        transparent
        color="#F59E0B"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0}
      />
    </Points>
  )
}

const EnvironmentScene = () => {
  const { currentScene } = useScene()
  
  // Scene mappings:
  // Scene 5: SkillsGalaxy
  // Scene 6: ConnectAid (FeaturedSystems)
  // Scene 9: AchievementsVault
  
  return (
    <>
      <ambientLight intensity={0.5} />
      
      {/* Dynamic Environments that fade/transform based on current scene */}
      <SkillsGalaxyEffect active={currentScene === 5} />
      <GeometricFragmentsEffect active={currentScene === 6 || currentScene === 7} />
      <AchievementParticlesEffect active={currentScene === 9} />
    </>
  )
}

export const EnvironmentCanvas = () => {
  // Mobile degradation check
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024
  const isLowEnd = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4
  
  const shouldRenderWebGL = !isMobile || !isLowEnd

  if (!shouldRenderWebGL) return null

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <EnvironmentScene />
      </Canvas>
    </div>
  )
}
