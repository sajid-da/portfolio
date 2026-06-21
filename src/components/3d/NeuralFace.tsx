import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FACE_VERTICES, PARTICLE_COUNT } from './faceVertices'

// ─── Shader source ────────────────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec2  uGaze;
  uniform float uBlink;
  uniform float uBreath;
  uniform float uScrollDepth;
  uniform vec3  uFocusColor;
  uniform float uConverge;

  attribute vec3  aPos;
  attribute float aSize;
  attribute float aPulseOffset;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Start with the instanced coordinate
    vec3 p = aPos;

    // ── Breathing: subtle scale oscillation ──
    float breathScale = 1.0 + uBreath * 0.025;
    p *= breathScale;

    // ── Contact convergence: pull particles toward eye region ──
    if (uConverge > 0.0) {
      vec3 eyeCenter = vec3(0.0, 0.23, 0.4);
      p = mix(p, eyeCenter + (p - eyeCenter) * 0.3, uConverge * 0.6);
    }

    // ── Gaze: offset eye-region particles based on mouse ──
    float eyeMask = smoothstep(0.25, 0.0, length(p.xy - vec2(0.0, 0.23)));
    p.xy += uGaze * eyeMask * 0.08;

    // ── Blink: collapse eye particles vertically ──
    float blinkMask = smoothstep(0.22, 0.0, abs(p.x) - 0.1) *
                      smoothstep(0.15, 0.0, abs(p.y - 0.23));
    p.y -= blinkMask * uBlink * 0.12;

    // ── Neural pulse wave from eye center ──
    float dist = length(p - vec3(0.0, 0.23, 0.35));
    float pulse = sin(dist * 8.0 - uTime * 3.0 + aPulseOffset) * 0.5 + 0.5;
    pulse *= uEnergy;

    // ── Scroll depth: fade and shrink particles away from face center mid-site ──
    float scrollFade = 1.0 - smoothstep(0.3, 0.7, uScrollDepth) * 0.45;
    scrollFade += smoothstep(0.7, 1.0, uScrollDepth) * 0.35;

    // ── Size Calculation ──
    float s = aSize * (1.0 + pulse * 0.6) * scrollFade * 0.0025;

    // Compute final vertex position
    // "position" is the vertex of the base geometry (circle/plane)
    // "p" is the particle's origin
    vec3 finalPos = p + position * s;

    vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // ── Color ──
    float glow = 0.4 + pulse * 0.6 * uEnergy;
    vColor = mix(vec3(0.0, 0.83, 1.0), uFocusColor, uEnergy * 0.7) * glow;
    vAlpha = (0.5 + pulse * 0.5) * scrollFade;
  }
`

const fragmentShader = `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // We are rendering a circle geometry, so we don't need pointcoord discard
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

// ─── Section color map ────────────────────────────────────────────────────────

const SECTION_STATES: Record<string, { color: [number, number, number]; energy: number }> = {
  hero:         { color: [0.0, 0.83, 1.0],  energy: 0.30 },
  about:        { color: [0.0, 0.83, 1.0],  energy: 0.40 },
  skills:       { color: [0.23, 0.51, 0.96], energy: 0.60 },
  projects:     { color: [0.54, 0.36, 0.96], energy: 0.80 },
  achievements: { color: [0.96, 0.62, 0.04], energy: 0.90 },
  contact:      { color: [1.0, 1.0, 1.0],   energy: 1.00 },
}

// ─── Main 3D scene ────────────────────────────────────────────────────────────

interface NeuralSceneProps {
  mouseRef: React.MutableRefObject<[number, number]>
  idleRef: React.MutableRefObject<number>
  sectionRef: React.MutableRefObject<string>
  scrollDepthRef: React.MutableRefObject<number>
}

const NeuralScene = ({ mouseRef, idleRef, sectionRef, scrollDepthRef }: NeuralSceneProps) => {
  const { size } = useThree()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const energyRef = useRef(0.3)
  const colorRef = useRef(new THREE.Color(0, 0.83, 1))
  const blinkRef = useRef(0)
  const nextBlinkRef = useRef(Date.now() + 10000 + Math.random() * 10000)
  const blinkingRef = useRef(false)

  // Use Instanced attributes
  const { positions, sizes, pulseOffsets, count } = useMemo(() => {
    const isMobile = size.width < 768
    const targetCount = isMobile ? 3000 : PARTICLE_COUNT
    const step = Math.max(1, Math.ceil(PARTICLE_COUNT / targetCount))
    const p: number[] = []
    const s: number[] = []
    const po: number[] = []
    
    for (let i = 0; i < PARTICLE_COUNT; i += step) {
      p.push(FACE_VERTICES[i * 3], FACE_VERTICES[i * 3 + 1], FACE_VERTICES[i * 3 + 2])
      s.push(1.5 + Math.random() * 2.5)
      po.push(Math.random() * Math.PI * 2)
    }
    return {
      positions: new Float32Array(p),
      sizes: new Float32Array(s),
      pulseOffsets: new Float32Array(po),
      count: p.length / 3
    }
  }, [size.width])

  const particleUniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uEnergy:      { value: 0.3 },
    uGaze:        { value: new THREE.Vector2(0, 0) },
    uBlink:       { value: 0 },
    uBreath:      { value: 0 },
    uScrollDepth: { value: 0 },
    uFocusColor:  { value: new THREE.Vector3(0, 0.83, 1) },
    uConverge:    { value: 0 },
  }), [])

  const doBlink = useCallback(async () => {
    if (blinkingRef.current) return
    blinkingRef.current = true
    const steps = 12
    for (let i = 0; i <= steps; i++) {
      blinkRef.current = i < steps / 2 ? i / (steps / 2) : 1 - (i - steps / 2) / (steps / 2)
      await new Promise(r => setTimeout(r, 16))
    }
    blinkRef.current = 0
    blinkingRef.current = false
    nextBlinkRef.current = Date.now() + 8000 + Math.random() * 12000
  }, [])

  // Initialize instanceMatrix to Identity
  useEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D()
      for (let i = 0; i < count; i++) {
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [count])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const idleSec = (Date.now() - idleRef.current) / 1000
    const section = sectionRef.current || 'hero'
    const sectionState = SECTION_STATES[section] ?? SECTION_STATES.hero

    if (Date.now() > nextBlinkRef.current) doBlink()

    if (idleSec < 5) {
      const [mx, my] = mouseRef.current
      const predict = 0.3
      gazeTargetRef.current.set(mx * (1 + predict), my * (1 + predict))
    } else if (idleSec < 10) {
      const fade = 1 - (idleSec - 5) / 5
      const [mx, my] = mouseRef.current
      gazeTargetRef.current.set(mx * fade, my * fade)
    } else {
      gazeTargetRef.current.set(
        Math.sin(t * 0.07) * 0.03,
        Math.sin(t * 0.11) * 0.02
      )
    }

    gazeTargetRef.current.clampLength(0, 0.14)
    gazeRef.current.lerp(gazeTargetRef.current, 0.05)

    energyRef.current += (sectionState.energy - energyRef.current) * 0.02
    const [cr, cg, cb] = sectionState.color
    colorRef.current.lerp(new THREE.Color(cr, cg, cb), 0.02)

    const breath = Math.sin(t * (Math.PI * 2) / 10) * 0.5 + 0.5
    const converge = section === 'contact' ? Math.min(energyRef.current, 1.0) : 0

    const pu = particleUniforms
    pu.uTime.value = t
    pu.uEnergy.value = energyRef.current
    pu.uGaze.value.copy(gazeRef.current)
    pu.uBlink.value = blinkRef.current
    pu.uBreath.value = breath
    pu.uScrollDepth.value = scrollDepthRef.current
    pu.uFocusColor.value.set(colorRef.current.r, colorRef.current.g, colorRef.current.b)
    pu.uConverge.value = converge
  })



  return (
    <group scale={[2.0, 2.0, 2.0]} position={[0, -0.5, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <circleGeometry args={[1, 6]}>
          <instancedBufferAttribute attach="attributes-aPos" args={[positions, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <instancedBufferAttribute attach="attributes-aPulseOffset" args={[pulseOffsets, 1]} />
        </circleGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={particleUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  )
}

// ─── Wrapper with event handling ──────────────────────────────────────────────

export const NeuralFace = () => {
  const mouseRef = useRef<[number, number]>([0, 0])
  const idleRef = useRef<number>(Date.now())
  const sectionRef = useRef<string>('hero')
  const scrollDepthRef = useRef<number>(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ]
      idleRef.current = Date.now()
    }
    const handleScroll = () => {
      idleRef.current = Date.now()
      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollDepthRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    const sections = ['hero', 'about', 'skills', 'projects', 'achievements', 'contact']
    const observers: IntersectionObserver[] = []
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) sectionRef.current = id },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    window.addEventListener('mousemove', handleMouse, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('scroll', handleScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#000', 3, 8]} />
        <NeuralScene
          mouseRef={mouseRef}
          idleRef={idleRef}
          sectionRef={sectionRef}
          scrollDepthRef={scrollDepthRef}
        />
      </Canvas>
    </div>
  )
}
