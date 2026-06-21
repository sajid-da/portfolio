import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Shaders ─────────────────────────────────────────────────────────────────

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uGaze;
  uniform float uGlobalAlpha;
  uniform vec3 uColor;
  uniform float uSmile;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // 1. Initial Texture Sample to get Luminance (Depth Map approximation)
    vec4 baseTex = texture2D(uTexture, uv);
    float luma = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));

    // 2. Fake 3D Parallax / Gaze Tracking (Increased sensitivity)
    // Darker areas (background) move less, bright areas (foreground) move more
    vec2 parallaxOffset = uGaze * (luma * 0.15); // Increased from 0.05 to 0.15
    
    // 3. Subtle Breathing Warp
    float breath = sin(uTime * 1.5 + uv.y * 5.0) * 0.003;
    uv += parallaxOffset + vec2(0.0, breath);

    // 4. Smile Distortion
    // Approximate mouth region: center x=0.5, y=0.3
    // We want to pull the corners of the mouth UP.
    // To move the image UP, we sample FROM BELOW (subtract from uv.y).
    float mouthDist = distance(uv, vec2(0.5, 0.28));
    float mouthMask = smoothstep(0.15, 0.0, mouthDist);
    // The distortion is stronger at the corners (abs(x - 0.5) is larger)
    float cornerPull = abs(uv.x - 0.5) * 0.4;
    uv.y -= uSmile * mouthMask * cornerPull;

    // 5. Final Texture Sample with distorted UVs
    vec4 texColor = texture2D(uTexture, uv);
    float finalLuma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // 6. Colorize (Replace Gold with Portfolio Cyan)
    vec3 finalColor = uColor * finalLuma * 2.0;

    // 7. Smooth Edges (Vignette)
    float dist = distance(vUv, vec2(0.5));
    float vignette = smoothstep(0.5, 0.2, dist);

    gl_FragColor = vec4(finalColor, texColor.a * uGlobalAlpha * vignette);
  }
`;

// ─── Section Configuration ────────────────────────────────────────────────────

// Face is scaled down and pushed right to allow content to breathe
const SECTION_STATES: Record<string, { opacity: number; xOffset: number }> = {
  hero:         { opacity: 1.0, xOffset: 0.0 },
  about:        { opacity: 1.0, xOffset: 2.8 },
  'about-core': { opacity: 0.8, xOffset: 2.8 },
  skills:       { opacity: 0.6, xOffset: 2.8 },
  projects:     { opacity: 0.6, xOffset: 2.8 },
  achievements: { opacity: 0.4, xOffset: 2.8 },
  contact:      { opacity: 1.0, xOffset: 0.0 },
}

// ─── Main 3D Scene ────────────────────────────────────────────────────────────

interface NeuralSceneProps {
  mouseRef: React.MutableRefObject<[number, number]>
  idleRef: React.MutableRefObject<number>
  sectionRef: React.MutableRefObject<string>
}

const NeuralScene = ({ mouseRef, idleRef, sectionRef }: NeuralSceneProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const opacityRef = useRef(1.0)
  const xOffsetRef = useRef(0.0)

  // Load the image texture
  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load('/neural-face.png')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const uniforms = useMemo(() => ({
    uTexture:     { value: texture },
    uTime:        { value: 0 },
    uGaze:        { value: new THREE.Vector2(0, 0) },
    uGlobalAlpha: { value: 1.0 },
    uColor:       { value: new THREE.Color('#00D4FF') }, // The exact portfolio cyan
    uSmile:       { value: 0.0 }
  }), [texture])

  const smileRef = useRef(0.0)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const idleSec = (Date.now() - idleRef.current) / 1000
    const section = sectionRef.current || 'hero'
    
    let effectiveSection = section;
    if (section === 'terminal') effectiveSection = 'achievements';

    const sectionState = SECTION_STATES[effectiveSection] ?? SECTION_STATES.hero
    let targetOpacity = sectionState.opacity;
    if (section === 'terminal') targetOpacity = 0.15;

    // ── Gaze Tracking & Smiling ──
    let targetSmile = 0.0;
    
    if (idleSec < 2) {
      const [mx, my] = mouseRef.current
      gazeTargetRef.current.set(mx, my) 
    } else {
      const lockSpeed = Math.min(1.0, (idleSec - 2) * 0.05) 
      const driftX = Math.sin(t * 0.3) * 0.05 * (1.0 - lockSpeed)
      const driftY = Math.cos(t * 0.2) * 0.05 * (1.0 - lockSpeed)
      gazeTargetRef.current.set(driftX, driftY)
    }

    // Smile when idle for > 2 seconds, or briefly every 15 seconds
    if (idleSec > 2.0 || (t % 15.0) < 2.0) {
      targetSmile = 1.0;
    }

    gazeRef.current.lerp(gazeTargetRef.current, 0.08)
    smileRef.current += (targetSmile - smileRef.current) * 0.05

    // ── Interpolations ──
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.05
    xOffsetRef.current += (sectionState.xOffset - xOffsetRef.current) * 0.04
    
    if (meshRef.current) {
      meshRef.current.position.x = xOffsetRef.current
    }

    // Update Uniforms
    uniforms.uTime.value = t
    uniforms.uGaze.value.copy(gazeRef.current)
    uniforms.uGlobalAlpha.value = opacityRef.current
    uniforms.uSmile.value = smileRef.current
  })

  // The image is perfectly square, so aspect ratio is 1:1. Scale dictates size.
  return (
    <mesh ref={meshRef} scale={[6, 6, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export const NeuralFace = () => {
  const mouseRef = useRef<[number, number]>([0, 0])
  const idleRef = useRef<number>(Date.now())
  const sectionRef = useRef<string>('hero')

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      ]
      idleRef.current = Date.now()
    }

    const sections = ['hero', 'about', 'about-core', 'skills', 'projects', 'achievements', 'terminal', 'contact']
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

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      observers.forEach(o => o.disconnect())
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#050505', 3, 8]} />
        <NeuralScene
          mouseRef={mouseRef}
          idleRef={idleRef}
          sectionRef={sectionRef}
        />
      </Canvas>
    </div>
  )
}
