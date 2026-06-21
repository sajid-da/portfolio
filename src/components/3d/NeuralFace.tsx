import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { skullPoints, eyePoints, eyeTypes } from './faceVertices'

// ─── Shader Source ────────────────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform vec2  uGaze;
  uniform vec2  uHeadTilt;
  uniform float uBlink;
  uniform float uBreath;
  uniform vec3  uBaseColor;
  uniform vec3  uHighlightColor;
  uniform float uIsEyeMesh;

  attribute vec3  aPos;
  attribute float aSize;
  attribute float aPulseOffset;
  attribute float aType; // 0.0 = Iris, 1.0 = Orbit (Only for eyes)

  varying vec3  vColor;
  varying float vAlpha;
  varying float vType;
  varying vec2  vPointCoord;

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

  // Rotation around Z for eye orbit
  mat3 rotationZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      c, -s, 0.0,
      s,  c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  void main() {
    vec3 p = aPos;
    vType = uIsEyeMesh > 0.5 ? aType : -1.0;

    // ── Breathing: subtle scale oscillation ──
    float breathScale = 1.0 + uBreath * 0.015;
    p *= breathScale;

    if (uIsEyeMesh > 0.5) {
      // ── Separate Eye Center Logic ──
      // Assume left eye center is x < 0, right is x > 0
      vec3 eyeCenter = vec3(sign(p.x) * 0.18, 0.12, 0.45);
      
      // Orbit particles rotate around the eye center
      if (vType > 0.5) {
        vec3 local = p - eyeCenter;
        local = rotationZ(uTime * 0.5 + aPulseOffset) * local;
        p = eyeCenter + local;
      }

      // ── Physical Spheroid Gaze Tracking ──
      // Rotate the eyes toward the cursor instead of just sliding them
      mat3 gazeRot = rotationMatrix(uGaze * 0.6); // Eyes rotate further
      p = eyeCenter + gazeRot * (p - eyeCenter);

      // ── Blink: collapse eye particles vertically ──
      float blinkMask = smoothstep(0.15, 0.0, abs(p.y - 0.12));
      p.y -= blinkMask * uBlink * 0.06;
    }

    // ── Head Tilt (applies to everything, including eyes after local transforms) ──
    p = rotationMatrix(uHeadTilt) * p;

    // ── Neural pulse wave ──
    float dist = length(p);
    float pulse = sin(dist * 10.0 - uTime * 4.0 + aPulseOffset) * 0.5 + 0.5;

    // ── Size Calculation ──
    float s = aSize * (1.0 + pulse * 0.5) * 0.003;
    if (uIsEyeMesh > 0.5) {
      if (vType < 0.5) {
        s *= 1.2; // Iris particles are dense but small
      } else {
        s *= 0.8; // Orbit particles are faint
      }
    }

    vec3 finalPos = p + position * s;
    vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // ── Color ──
    float glow = 0.5 + pulse * 0.5;
    if (uIsEyeMesh > 0.5) {
      if (vType < 0.5) {
        // Iris: Dense Cyan Ring
        vColor = uBaseColor;
        vAlpha = 1.0;
      } else {
        // Orbit: Rotating faint particles
        vColor = uHighlightColor;
        vAlpha = 0.4 + pulse * 0.4;
      }
    } else {
      // Skull: Muted cyan/purple network, pushed slightly back to be atmospheric
      vColor = mix(uBaseColor, uHighlightColor, pulse * 0.6);
      vAlpha = 0.15 + pulse * 0.2; // Highly reduced opacity for skull
    }
  }
`

const fragmentShader = `
  uniform float uGlobalAlpha;
  varying vec3  vColor;
  varying float vAlpha;
  varying float vType;

  void main() {
    // Render soft circles instead of hard disks for everything
    // But for the Iris (vType < 0.5), we can make them sharper
    // Since we use instanced mesh with circle geometry, the shape is already circular.
    // We just apply a soft glow based on fragment coordinate distance if we want, but base geometry is fine.
    
    float alpha = vAlpha * uGlobalAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Section Configuration ────────────────────────────────────────────────────

// The face is now scaled down significantly and pushed extreme right for content
const SECTION_STATES: Record<string, { opacity: number; xOffset: number }> = {
  hero:         { opacity: 1.0, xOffset: 0.0 },     // Centered
  about:        { opacity: 1.0, xOffset: 2.8 },     // Mission Control
  'about-core': { opacity: 0.8, xOffset: 2.8 },     // About Core
  skills:       { opacity: 0.6, xOffset: 2.8 },     // Skills Galaxy
  projects:     { opacity: 0.6, xOffset: 2.8 },     // Featured Systems
  achievements: { opacity: 0.4, xOffset: 2.8 },     // Achievements & Certs
  contact:      { opacity: 1.0, xOffset: 0.0 },     // Contact (Centered)
}

// ─── Main 3D Scene ────────────────────────────────────────────────────────────

interface NeuralSceneProps {
  mouseRef: React.MutableRefObject<[number, number]>
  idleRef: React.MutableRefObject<number>
  sectionRef: React.MutableRefObject<string>
}

const NeuralScene = ({ mouseRef, idleRef, sectionRef }: NeuralSceneProps) => {
  const skullMeshRef = useRef<THREE.InstancedMesh>(null)
  const eyeMeshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const gazeRef = useRef(new THREE.Vector2(0, 0))
  const gazeTargetRef = useRef(new THREE.Vector2(0, 0))
  const headTiltRef = useRef(new THREE.Vector2(0, 0))
  const headTiltTargetRef = useRef(new THREE.Vector2(0, 0))
  
  const blinkRef = useRef(0)
  const nextBlinkRef = useRef(Date.now() + 5000 + Math.random() * 8000)
  const blinkingRef = useRef(false)

  const opacityRef = useRef(1.0)
  const xOffsetRef = useRef(0.0)

  // ── Setup Instanced Data ──
  const { skullData, eyeData } = useMemo(() => {
    // SKULL
    const sCount = skullPoints.length / 3
    const sSizes = new Float32Array(sCount)
    const sPulse = new Float32Array(sCount)
    for (let i = 0; i < sCount; i++) {
      sSizes[i] = 0.5 + Math.random() * 1.5 // Smaller particles for skull
      sPulse[i] = Math.random() * Math.PI * 2
    }

    // EYES
    const eCount = eyePoints.length / 3
    const eSizes = new Float32Array(eCount)
    const ePulse = new Float32Array(eCount)
    for (let i = 0; i < eCount; i++) {
      eSizes[i] = 1.0 + Math.random() * 1.5
      ePulse[i] = Math.random() * Math.PI * 2
    }

    return {
      skullData: { count: sCount, sizes: sSizes, pulse: sPulse },
      eyeData: { count: eCount, sizes: eSizes, pulse: ePulse }
    }
  }, [])

  const skullUniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uGaze:           { value: new THREE.Vector2(0, 0) },
    uHeadTilt:       { value: new THREE.Vector2(0, 0) },
    uBlink:          { value: 0 },
    uBreath:         { value: 0 },
    uIsEyeMesh:      { value: 0.0 },
    uBaseColor:      { value: new THREE.Color('#00D4FF') }, // Cyan
    uHighlightColor: { value: new THREE.Color('#8B5CF6') }, // Purple
    uGlobalAlpha:    { value: 1.0 }
  }), [])

  const eyeUniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uGaze:           { value: new THREE.Vector2(0, 0) },
    uHeadTilt:       { value: new THREE.Vector2(0, 0) },
    uBlink:          { value: 0 },
    uBreath:         { value: 0 },
    uIsEyeMesh:      { value: 1.0 },
    uBaseColor:      { value: new THREE.Color('#00FFFF') }, // Intense Cyan Iris
    uHighlightColor: { value: new THREE.Color('#FFFFFF') }, // White Orbit
    uGlobalAlpha:    { value: 1.0 }
  }), [])

  const doBlink = useCallback(async () => {
    if (blinkingRef.current) return
    blinkingRef.current = true
    const steps = 6
    for (let i = 0; i <= steps; i++) {
      blinkRef.current = i < steps / 2 ? i / (steps / 2) : 1 - (i - steps / 2) / (steps / 2)
      await new Promise(r => setTimeout(r, 16))
    }
    blinkRef.current = 0
    blinkingRef.current = false
    nextBlinkRef.current = Date.now() + 4000 + Math.random() * 8000
  }, [])

  // Initialize instance matrices
  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (skullMeshRef.current) {
      for (let i = 0; i < skullData.count; i++) {
        dummy.updateMatrix()
        skullMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      skullMeshRef.current.instanceMatrix.needsUpdate = true
    }
    if (eyeMeshRef.current) {
      for (let i = 0; i < eyeData.count; i++) {
        dummy.updateMatrix()
        eyeMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      eyeMeshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [skullData.count, eyeData.count])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const idleSec = (Date.now() - idleRef.current) / 1000
    const section = sectionRef.current || 'hero'
    
    // Map terminal section to Resume opacity rules
    let effectiveSection = section;
    if (section === 'terminal') {
        effectiveSection = 'achievements'; // Will handle 15% override below
    }

    const sectionState = SECTION_STATES[effectiveSection] ?? SECTION_STATES.hero
    let targetOpacity = sectionState.opacity;
    
    if (section === 'terminal') {
        targetOpacity = 0.15; // 15% for resume/terminal
    }

    if (Date.now() > nextBlinkRef.current) doBlink()

    // ── Gaze & Tilt Logic ──
    if (idleSec < 2) {
      // Active Tracking
      const [mx, my] = mouseRef.current
      gazeTargetRef.current.set(mx * 0.8, my * 0.8) // Eyes track cursor position directly
      headTiltTargetRef.current.set(mx * 0.2, my * 0.2) // Head tilts slightly
    } else {
      // Idle state: eyes slowly lock to center (0,0), head tilts back slowly
      const lockSpeed = Math.min(1.0, (idleSec - 2) * 0.05) // Gradually lock over time
      
      // Idle drift
      const driftX = Math.sin(t * 0.2) * 0.1 * (1.0 - lockSpeed)
      const driftY = Math.cos(t * 0.15) * 0.1 * (1.0 - lockSpeed)
      
      gazeTargetRef.current.set(driftX, driftY)
      headTiltTargetRef.current.set(driftX * 0.1, driftY * 0.1)
    }

    gazeTargetRef.current.clampLength(0, 1.0)
    gazeRef.current.lerp(gazeTargetRef.current, 0.1)
    headTiltRef.current.lerp(headTiltTargetRef.current, 0.05)

    // ── Section Interpolation ──
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.05
    xOffsetRef.current += (sectionState.xOffset - xOffsetRef.current) * 0.03
    
    if (groupRef.current) {
      // Apply offset horizontally based on section
      groupRef.current.position.x = xOffsetRef.current
    }

    const breath = Math.sin(t * (Math.PI * 2) / 6) * 0.5 + 0.5;

    // Update Uniforms
    [skullUniforms, eyeUniforms].forEach((u: any) => {
      u.uTime.value = t
      u.uGaze.value.copy(gazeRef.current)
      u.uHeadTilt.value.copy(headTiltRef.current)
      u.uBlink.value = blinkRef.current
      u.uBreath.value = breath
      u.uGlobalAlpha.value = opacityRef.current
    })
  })

  return (
    // Scale reduced significantly from 2.8 to 1.5 to make content primary
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]} position={[0, -0.2, 0]}>
      
      {/* ── Layer 4: Eye Glow ── */}
      {/* A subtle glowing plane behind the eyes to give them atmospheric power */}
      <mesh position={[-0.18, 0.12, 0.40]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.15 * opacityRef.current} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.18, 0.12, 0.40]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial color="#00FFFF" transparent opacity={0.15 * opacityRef.current} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* SKULL */}
      <instancedMesh ref={skullMeshRef} args={[undefined, undefined, skullData.count]} frustumCulled={false}>
        <circleGeometry args={[1, 5]}>
          <instancedBufferAttribute attach="attributes-aPos" args={[skullPoints, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[skullData.sizes, 1]} />
          <instancedBufferAttribute attach="attributes-aPulseOffset" args={[skullData.pulse, 1]} />
          {/* Dummy aType for skull to avoid shader errors */}
          <instancedBufferAttribute attach="attributes-aType" args={[new Float32Array(skullData.count), 1]} />
        </circleGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={skullUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* EYES (Layer 2 & 3: Iris and Orbit) */}
      <instancedMesh ref={eyeMeshRef} args={[undefined, undefined, eyeData.count]} frustumCulled={false}>
        <circleGeometry args={[1, 8]}>
          <instancedBufferAttribute attach="attributes-aPos" args={[eyePoints, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[eyeData.sizes, 1]} />
          <instancedBufferAttribute attach="attributes-aPulseOffset" args={[eyeData.pulse, 1]} />
          <instancedBufferAttribute attach="attributes-aType" args={[eyeTypes, 1]} />
        </circleGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={eyeUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  )
}

// ─── Wrapper with Event Handling ──────────────────────────────────────────────

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
