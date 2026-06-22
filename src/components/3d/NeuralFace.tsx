import { useRef, useEffect, useMemo, useState } from 'react'
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
  uniform sampler2D uTextureSmile;
  uniform float uTime;
  uniform vec2 uGaze;
  uniform float uGlobalAlpha;
  uniform vec3 uColor;
  uniform float uSmile;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Sample both textures and blend them based on uSmile
    vec4 texNormal = texture2D(uTexture, uv);
    vec4 texSmile = texture2D(uTextureSmile, uv);
    vec4 baseTex = mix(texNormal, texSmile, uSmile);
    
    // Get luminance for depth
    float luma = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));

    // Parallax tracking math
    // uGaze * 0.05 shifts the ENTIRE face towards the cursor.
    // uGaze * (luma * 0.15) shifts the bright foreground (nose/brow) MORE than the dark background.
    // We SUBTRACT from uv to move the rendered image towards the gaze direction.
    vec2 baseOffset = uGaze * 0.05;
    vec2 depthOffset = uGaze * (luma * 0.15);
    
    float breath = sin(uTime * 1.5 + uv.y * 5.0) * 0.003;
    
    uv -= (baseOffset + depthOffset);
    uv.y += breath;

    // Final sample with warped UVs
    vec4 finalTexNormal = texture2D(uTexture, uv);
    vec4 finalTexSmile = texture2D(uTextureSmile, uv);
    vec4 finalTex = mix(finalTexNormal, finalTexSmile, uSmile);
    
    float finalLuma = dot(finalTex.rgb, vec3(0.299, 0.587, 0.114));

    // Colorize
    vec3 finalColor = uColor * finalLuma * 2.0;

    // Vignette
    float dist = distance(vUv, vec2(0.5));
    float vignette = smoothstep(0.5, 0.2, dist);

    gl_FragColor = vec4(finalColor, finalTex.a * uGlobalAlpha * vignette);
  }
`;

// ─── Section Configuration ────────────────────────────────────────────────────

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
  isMobile: boolean
}

const NeuralScene = ({ mouseRef, idleRef, sectionRef, isMobile }: NeuralSceneProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const opacityRef = useRef(1.0)
  const xOffsetRef = useRef(0.0)

  // Load the image textures
  const { texNormal, texSmile } = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const texN = loader.load('/neural-face.png')
    const texS = loader.load('/neural-face-smile.png')
    texN.colorSpace = THREE.SRGBColorSpace
    texS.colorSpace = THREE.SRGBColorSpace
    return { texNormal: texN, texSmile: texS }
  }, [])

  const uniforms = useMemo(() => ({
    uTexture:      { value: texNormal },
    uTextureSmile: { value: texSmile },
    uTime:         { value: 0 },
    uGaze:         { value: new THREE.Vector2(0, 0) },
    uGlobalAlpha:  { value: 1.0 },
    uColor:        { value: new THREE.Color('#00D4FF') },
    uSmile:        { value: 0.0 }
  }), [texNormal, texSmile])

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
    
    // Mobile optimization: keep face centered and lower opacity to avoid text conflict
    const targetOffset = isMobile ? 0.0 : sectionState.xOffset;
    if (isMobile) {
      targetOpacity *= 0.3; 
    }

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

    if (idleSec > 2.0 || (t % 15.0) < 2.0) {
      targetSmile = 1.0;
    }

    gazeRef.current.lerp(gazeTargetRef.current, 0.08)
    smileRef.current += (targetSmile - smileRef.current) * 0.05

    opacityRef.current += (targetOpacity - opacityRef.current) * 0.05
    xOffsetRef.current += (targetOffset - xOffsetRef.current) * 0.04
    
    if (meshRef.current) {
      meshRef.current.position.x = xOffsetRef.current
      // Removed the 3D plane rotation because it breaks the 2D image illusion by skewing the rectangle.
      // All 3D movement is now handled perfectly by the shader's internal UV depth mapping.
      meshRef.current.rotation.set(0, 0, 0)
    }

    uniforms.uTime.value = t
    uniforms.uGaze.value.copy(gazeRef.current)
    uniforms.uGlobalAlpha.value = opacityRef.current
    uniforms.uSmile.value = smileRef.current
  })

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  )
}
