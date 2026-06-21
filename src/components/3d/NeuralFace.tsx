import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FACE_VERTICES, PARTICLE_COUNT } from './faceVertices'

// ─── Shader source ────────────────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec2  uGaze;      // normalized mouse [-1,1]
  uniform float uBlink;     // 0=open 1=closed
  uniform float uBreath;    // 0..1 breathing oscillation
  uniform float uScrollDepth; // 0=hero 1=deep
  uniform vec3  uFocusColor;
  uniform float uConverge;  // contact section convergence

  attribute float aSize;
  attribute float aPulseOffset;

  varying vec3  vColor;
  varying float vAlpha;

  // Simple noise
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    return mix(hash(i), hash(i+1.0), smoothstep(0.0,1.0,f));
  }

  void main() {
    vec3 pos = position;

    // ── Breathing: subtle scale oscillation ──
    float breathScale = 1.0 + uBreath * 0.025;
    pos *= breathScale;

    // ── Contact convergence: pull particles toward eye region ──
    if (uConverge > 0.0) {
      vec3 eyeCenter = vec3(0.0, 0.23, 0.4);
      pos = mix(pos, eyeCenter + (pos - eyeCenter) * 0.3, uConverge * 0.6);
    }

    // ── Gaze: offset eye-region particles based on mouse ──
    float eyeMask = smoothstep(0.25, 0.0, length(pos.xy - vec2(0.0, 0.23)));
    pos.xy += uGaze * eyeMask * 0.08;

    // ── Blink: collapse eye particles vertically ──
    float blinkMask = smoothstep(0.22, 0.0, abs(pos.x) - 0.1) *
                      smoothstep(0.15, 0.0, abs(pos.y - 0.23));
    pos.y -= blinkMask * uBlink * 0.12;

    // ── Neural pulse wave from eye center ──
    float dist = length(pos - vec3(0.0, 0.23, 0.35));
    float pulse = sin(dist * 8.0 - uTime * 3.0 + aPulseOffset) * 0.5 + 0.5;
    pulse *= uEnergy;

    // ── Scroll depth: fade and shrink particles away from face center mid-site ──
    float scrollFade = 1.0 - smoothstep(0.3, 0.7, uScrollDepth) * 0.45;
    scrollFade += smoothstep(0.7, 1.0, uScrollDepth) * 0.35;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // ── Point size: base + energy pulse ──
    float size = aSize * (1.0 + pulse * 0.6) * scrollFade;
    gl_PointSize = size * (300.0 / -mvPos.z);
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
    vec2 uv = gl_PointCoord - 0.5;
    float r = dot(uv, uv);
    if (r > 0.25) discard;
    float alpha = (1.0 - smoothstep(0.1, 0.25, r)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Connection line shader ────────────────────────────────────────────────────

const lineVertShader = `
  uniform float uTime;
  uniform float uEnergy;
  attribute float aLinePhase;
  varying float vAlpha;
  void main() {
    vAlpha = (0.5 + sin(uTime * 2.0 + aLinePhase) * 0.5) * uEnergy * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragShader = `
  uniform vec3 uFocusColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(mix(vec3(0.0, 0.83, 1.0), uFocusColor, 0.5), vAlpha);
  }
`

// ─── Build static connection graph (once) ────────────────────────────────────

function buildConnectionGraph(vertices: Float32Array, maxEdges: number, maxDist: number) {
  const positions: number[] = []
  const phases: number[] = []
  const n = vertices.length / 3

  for (let i = 0; i < n && positions.length / 6 < maxEdges; i++) {
    const ax = vertices[i * 3], ay = vertices[i * 3 + 1], az = vertices[i * 3 + 2]
    // Only look at nearby indices to keep it O(n) roughly
    const stride = Math.max(1, Math.floor(n / 800))
    for (let j = i + 1; j < Math.min(i + 60, n); j += stride) {
      const bx = vertices[j * 3], by = vertices[j * 3 + 1], bz = vertices[j * 3 + 2]
      const dx = ax - bx, dy = ay - by, dz = az - bz
      if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
        positions.push(ax, ay, az, bx, by, bz)
        const phase = Math.random() * Math.PI * 2
        phases.push(phase, phase)
        if (positions.length / 6 >= maxEdges) break
      }
    }
  }
  return { positions: new Float32Array(positions), phases: new Float32Array(phases) }
}

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
  const particleMatRef = useRef<THREE.ShaderMaterial>(null)
  const lineMatRef = useRef<THREE.ShaderMaterial>(null)
  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const energyRef = useRef(0.3)
  const colorRef = useRef(new THREE.Color(0, 0.83, 1))
  const blinkRef = useRef(0)
  const nextBlinkRef = useRef(Date.now() + 10000 + Math.random() * 10000)
  const blinkingRef = useRef(false)

  // Build geometry ONCE
  const { positions: particlePos, sizes, pulseOffsets } = useMemo(() => {
    const isMobile = size.width < 768
    const targetCount = isMobile ? 2500 : Math.min(PARTICLE_COUNT, 10000)
    const step = Math.ceil(PARTICLE_COUNT / targetCount)
    const positions: number[] = []
    const sizes: number[] = []
    const pulseOffsets: number[] = []
    for (let i = 0; i < PARTICLE_COUNT; i += step) {
      positions.push(FACE_VERTICES[i * 3], FACE_VERTICES[i * 3 + 1], FACE_VERTICES[i * 3 + 2])
      sizes.push(1.5 + Math.random() * 2.5)
      pulseOffsets.push(Math.random() * Math.PI * 2)
    }
    return {
      positions: new Float32Array(positions),
      sizes: new Float32Array(sizes),
      pulseOffsets: new Float32Array(pulseOffsets),
    }
  }, [size.width])

  // Build STATIC connection graph ONCE
  const { positions: linePos, phases: linePhases } = useMemo(
    () => buildConnectionGraph(particlePos, 800, 0.28),
    [particlePos]
  )

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

  const lineUniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uEnergy:     { value: 0.3 },
    uFocusColor: { value: new THREE.Vector3(0, 0.83, 1) },
  }), [])

  // Blink handler
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

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const idleSec = (Date.now() - idleRef.current) / 1000
    const section = sectionRef.current || 'hero'
    const sectionState = SECTION_STATES[section] ?? SECTION_STATES.hero

    // Blink trigger
    if (Date.now() > nextBlinkRef.current) doBlink()

    // Target gaze based on idle state
    if (idleSec < 5) {
      // Normal tracking: 70% mouse + 30% ahead (prediction)
      const [mx, my] = mouseRef.current
      const predict = 0.3
      gazeTargetRef.current.set(mx * (1 + predict), my * (1 + predict))
    } else if (idleSec < 10) {
      // Fading: lerp toward center
      const fade = 1 - (idleSec - 5) / 5
      const [mx, my] = mouseRef.current
      gazeTargetRef.current.set(mx * fade, my * fade)
    } else {
      // Death stare: subtle micro-drift
      gazeTargetRef.current.set(
        Math.sin(t * 0.07) * 0.03,
        Math.sin(t * 0.11) * 0.02
      )
    }

    // Clamp gaze to ±8° (sin 8° ≈ 0.14)
    gazeTargetRef.current.clampLength(0, 0.14)
    gazeRef.current.lerp(gazeTargetRef.current, 0.05)

    // Energy lerp
    energyRef.current += (sectionState.energy - energyRef.current) * 0.02
    const [cr, cg, cb] = sectionState.color
    colorRef.current.lerp(new THREE.Color(cr, cg, cb), 0.02)

    // Breathing
    const breath = Math.sin(t * (Math.PI * 2) / 10) * 0.5 + 0.5

    // Contact convergence
    const converge = section === 'contact' ? Math.min(energyRef.current, 1.0) : 0

    // Update particle uniforms
    const pu = particleUniforms
    pu.uTime.value = t
    pu.uEnergy.value = energyRef.current
    pu.uGaze.value.copy(gazeRef.current)
    pu.uBlink.value = blinkRef.current
    pu.uBreath.value = breath
    pu.uScrollDepth.value = scrollDepthRef.current
    pu.uFocusColor.value.set(colorRef.current.r, colorRef.current.g, colorRef.current.b)
    pu.uConverge.value = converge

    // Update line uniforms
    lineUniforms.uTime.value = t
    lineUniforms.uEnergy.value = energyRef.current
    lineUniforms.uFocusColor.value.set(colorRef.current.r, colorRef.current.g, colorRef.current.b)
  })

  return (
    <group scale={[1.4, 1.4, 1.4]}>
      {/* Neural connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          <bufferAttribute attach="attributes-aLinePhase" args={[linePhases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMatRef}
          vertexShader={lineVertShader}
          fragmentShader={lineFragShader}
          uniforms={lineUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Particle face */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePos, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aPulseOffset" args={[pulseOffsets, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMatRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={particleUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
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
    // Mouse tracking
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

    // Section observer
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
      style={{ zIndex: -10, opacity: 0.85 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
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
