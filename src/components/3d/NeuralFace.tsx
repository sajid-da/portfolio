import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { faceVertices, faceLines, facePoints } from './faceVertices'

// ─── Shaders ─────────────────────────────────────────────────────────────────

const commonVertexFunctions = `
  uniform float uTime;
  uniform vec2  uGaze;
  uniform vec2  uHeadTilt;
  uniform float uBreath;
  uniform vec3  uBaseColor;
  uniform vec3  uHighlightColor;

  varying vec3  vColor;
  varying float vAlpha;

  // Rotation matrix around Y and X axes for head tilt
  mat3 rotationMatrix(vec2 tilt) {
    float cx = cos(tilt.y);
    float sx = sin(tilt.y);
    float cy = cos(tilt.x);
    float sy = sin(tilt.x);
    
    mat3 rx = mat3(
      1.0, 0.0, 0.0,
      0.0, cx, -sx,
      0.0, sx, cx
    );
    mat3 ry = mat3(
      cy, 0.0, sy,
      0.0, 1.0, 0.0,
      -sy, 0.0, cy
    );
    return ry * rx;
  }
`;

// LINE SHADER
const lineVertexShader = `
  ${commonVertexFunctions}
  void main() {
    vec3 p = position;

    // Breathing expansion
    p *= (1.0 + uBreath * 0.005);

    // Expressive Gaze Deform: eye sockets shift to track cursor
    vec3 eyeLeft = vec3(-0.18, 0.12, 0.45);
    vec3 eyeRight = vec3(0.18, 0.12, 0.45);
    
    float distL = length(p - eyeLeft);
    float distR = length(p - eyeRight);
    
    // Shift points near the eyes heavily towards the gaze direction
    float eyeMask = smoothstep(0.3, 0.0, min(distL, distR));
    p.xy += uGaze * eyeMask * 0.08; 

    // Global Head Tilt (subtle 3-5 degrees)
    p = rotationMatrix(uHeadTilt) * p;

    // Neural Pulse
    float dist = length(p);
    float pulse = sin(dist * 8.0 - uTime * 3.0) * 0.5 + 0.5;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Lines are subtle
    vColor = mix(uBaseColor, uHighlightColor, pulse * 0.5);
    vAlpha = 0.15 + pulse * 0.15;
  }
`;

const lineFragmentShader = `
  uniform float uGlobalAlpha;
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha * uGlobalAlpha);
  }
`;

// POINT SHADER
const pointVertexShader = `
  ${commonVertexFunctions}
  attribute float aPulseOffset;
  void main() {
    vec3 p = position;

    p *= (1.0 + uBreath * 0.005);

    vec3 eyeLeft = vec3(-0.18, 0.12, 0.45);
    vec3 eyeRight = vec3(0.18, 0.12, 0.45);
    float distL = length(p - eyeLeft);
    float distR = length(p - eyeRight);
    
    float eyeMask = smoothstep(0.3, 0.0, min(distL, distR));
    p.xy += uGaze * eyeMask * 0.08; 

    p = rotationMatrix(uHeadTilt) * p;

    float dist = length(p);
    float pulse = sin(dist * 12.0 - uTime * 4.0 + aPulseOffset) * 0.5 + 0.5;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPos;
    
    // Size changes based on distance (closer = bigger)
    gl_PointSize = (3.0 + pulse * 2.0) * (1.0 / -mvPos.z);

    // Points are brighter nodes
    vColor = mix(uBaseColor, vec3(1.0, 1.0, 1.0), pulse * 0.8);
    vAlpha = 0.4 + pulse * 0.6;
  }
`;

const pointFragmentShader = `
  uniform float uGlobalAlpha;
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    
    // Soft circle
    float alpha = vAlpha * (1.0 - smoothstep(0.3, 0.5, d)) * uGlobalAlpha;
    gl_FragColor = vec4(vColor, alpha);
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
}

const NeuralScene = ({ mouseRef, idleRef, sectionRef }: NeuralSceneProps) => {
  const groupRef = useRef<THREE.Group>(null)

  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const headTiltRef = useRef(new THREE.Vector2(0, 0))
  const headTiltTargetRef = useRef(new THREE.Vector2(0, 0))
  
  const opacityRef = useRef(1.0)
  const xOffsetRef = useRef(0.0)

  // ── Setup Geometries ──
  const { lineGeometry, pointGeometry } = useMemo(() => {
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.BufferAttribute(faceVertices, 3))
    lGeo.setIndex(new THREE.BufferAttribute(faceLines, 1))

    // For points, we need to extract only the used vertices so we don't render floating un-connected nodes
    const pCount = facePoints.length
    const pPos = new Float32Array(pCount * 3)
    const pPulse = new Float32Array(pCount)
    
    for (let i = 0; i < pCount; i++) {
      const vIdx = facePoints[i]
      pPos[i*3] = faceVertices[vIdx*3]
      pPos[i*3+1] = faceVertices[vIdx*3+1]
      pPos[i*3+2] = faceVertices[vIdx*3+2]
      pPulse[i] = Math.random() * Math.PI * 2
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('aPulseOffset', new THREE.BufferAttribute(pPulse, 1))

    return { lineGeometry: lGeo, pointGeometry: pGeo }
  }, [])

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uGaze:           { value: new THREE.Vector2(0, 0) },
    uHeadTilt:       { value: new THREE.Vector2(0, 0) },
    uBreath:         { value: 0 },
    uBaseColor:      { value: new THREE.Color('#00D4FF') }, // Cyan
    uHighlightColor: { value: new THREE.Color('#8B5CF6') }, // Purple
    uGlobalAlpha:    { value: 1.0 }
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const idleSec = (Date.now() - idleRef.current) / 1000
    const section = sectionRef.current || 'hero'
    
    let effectiveSection = section;
    if (section === 'terminal') {
        effectiveSection = 'achievements'; 
    }

    const sectionState = SECTION_STATES[effectiveSection] ?? SECTION_STATES.hero
    let targetOpacity = sectionState.opacity;
    if (section === 'terminal') targetOpacity = 0.15;

    // ── Gaze & Tilt Logic ──
    if (idleSec < 2) {
      // Active Tracking
      const [mx, my] = mouseRef.current
      // Gaze is expressive (moves up to 0.8 units locally)
      gazeTargetRef.current.set(mx * 0.8, my * 0.8) 
      // Head tilt is limited to ~3-5 degrees (0.05 to 0.08 radians)
      headTiltTargetRef.current.set(mx * 0.06, my * 0.06) 
    } else {
      // Idle state
      const lockSpeed = Math.min(1.0, (idleSec - 2) * 0.05) 
      const driftX = Math.sin(t * 0.2) * 0.05 * (1.0 - lockSpeed)
      const driftY = Math.cos(t * 0.15) * 0.05 * (1.0 - lockSpeed)
      
      gazeTargetRef.current.set(driftX, driftY)
      headTiltTargetRef.current.set(driftX * 0.5, driftY * 0.5)
    }

    gazeRef.current.lerp(gazeTargetRef.current, 0.1)
    headTiltRef.current.lerp(headTiltTargetRef.current, 0.05)

    // ── Section Interpolation ──
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.05
    xOffsetRef.current += (sectionState.xOffset - xOffsetRef.current) * 0.03
    
    if (groupRef.current) {
      groupRef.current.position.x = xOffsetRef.current
    }

    const breath = Math.sin(t * (Math.PI * 2) / 6) * 0.5 + 0.5;

    // Update Uniforms
    uniforms.uTime.value = t
    uniforms.uGaze.value.copy(gazeRef.current)
    uniforms.uHeadTilt.value.copy(headTiltRef.current)
    uniforms.uBreath.value = breath
    uniforms.uGlobalAlpha.value = opacityRef.current
  })

  return (
    // Keep scale around 1.5 as agreed
    <group ref={groupRef} scale={[1.6, 1.6, 1.6]} position={[0, -0.2, 0]}>
      
      {/* ── The Network Connections (Lines) ── */}
      <lineSegments geometry={lineGeometry}>
        <shaderMaterial
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* ── The Network Nodes (Points) ── */}
      <points geometry={pointGeometry}>
        <shaderMaterial
          vertexShader={pointVertexShader}
          fragmentShader={pointFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

    </group>
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
