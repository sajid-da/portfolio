import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { skullPoints, eyePoints } from './faceVertices'

// ─── Shader Source ────────────────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform vec2  uGaze;
  uniform vec2  uHeadTilt;
  uniform float uBlink;
  uniform float uBreath;
  uniform vec3  uBaseColor;
  uniform vec3  uHighlightColor;
  uniform float uIsEye;

  attribute vec3  aPos;
  attribute float aSize;
  attribute float aPulseOffset;

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

  void main() {
    vec3 p = aPos;

    // ── Breathing: subtle scale oscillation ──
    float breathScale = 1.0 + uBreath * 0.015;
    p *= breathScale;

    // ── Head Tilt (applies to all) ──
    p = rotationMatrix(uHeadTilt) * p;

    if (uIsEye > 0.5) {
      // ── Aggressive Eye Tracking ──
      // Eyes move further than the rest of the head
      p.xy += uGaze * 0.25;

      // ── Blink: collapse eye particles vertically ──
      // Assume eyes are roughly around y=0.1
      float blinkMask = smoothstep(0.15, 0.0, abs(p.y - 0.1));
      p.y -= blinkMask * uBlink * 0.08;
    }

    // ── Neural pulse wave ──
    float dist = length(p);
    float pulse = sin(dist * 10.0 - uTime * 4.0 + aPulseOffset) * 0.5 + 0.5;

    // ── Size Calculation ──
    float s = aSize * (1.0 + pulse * 0.5) * 0.003;
    if (uIsEye > 0.5) {
      s *= 1.5; // Eyes are slightly larger/brighter
    }

    vec3 finalPos = p + position * s;
    vec4 mvPos = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // ── Color ──
    float glow = 0.5 + pulse * 0.5;
    if (uIsEye > 0.5) {
      // Eyes: Intense cyan/white glow
      vColor = mix(uBaseColor, vec3(1.0, 1.0, 1.0), pulse * 0.8 + 0.2);
      vAlpha = 0.8 + pulse * 0.2;
    } else {
      // Skull: Muted cyan/purple network
      vColor = mix(uBaseColor, uHighlightColor, pulse * 0.6);
      vAlpha = 0.3 + pulse * 0.4;
    }
  }
`

const fragmentShader = `
  uniform float uGlobalAlpha;
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    // Optional: soft circle for point rendering if using GL_POINTS
    // But we are using instanced circle geometry, so PointCoord isn't strictly needed.
    gl_FragColor = vec4(vColor, vAlpha * uGlobalAlpha);
  }
`

// ─── Section Configuration ────────────────────────────────────────────────────

const SECTION_STATES: Record<string, { opacity: number; xOffset: number }> = {
  hero:         { opacity: 1.0, xOffset: 0.0 },
  about:        { opacity: 0.7, xOffset: 1.5 },
  skills:       { opacity: 0.55, xOffset: 1.5 },
  projects:     { opacity: 0.4, xOffset: 1.5 },
  achievements: { opacity: 0.2, xOffset: 1.5 },
  contact:      { opacity: 1.0, xOffset: 0.0 },
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
      sSizes[i] = 1.0 + Math.random() * 2.0
      sPulse[i] = Math.random() * Math.PI * 2
    }

    // EYES
    const eCount = eyePoints.length / 3
    const eSizes = new Float32Array(eCount)
    const ePulse = new Float32Array(eCount)
    for (let i = 0; i < eCount; i++) {
      eSizes[i] = 2.0 + Math.random() * 2.0 // Denser/larger
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
    uIsEye:          { value: 0.0 },
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
    uIsEye:          { value: 1.0 },
    uBaseColor:      { value: new THREE.Color('#00FFFF') }, // Bright Cyan
    uHighlightColor: { value: new THREE.Color('#FFFFFF') }, // White highlights
    uGlobalAlpha:    { value: 1.0 }
  }), [])

  const doBlink = useCallback(async () => {
    if (blinkingRef.current) return
    blinkingRef.current = true
    const steps = 8
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
    const sectionState = SECTION_STATES[section] ?? SECTION_STATES.hero

    if (Date.now() > nextBlinkRef.current) doBlink()

    // ── Gaze & Tilt Logic ──
    if (idleSec < 2) {
      // Active Tracking
      const [mx, my] = mouseRef.current
      gazeTargetRef.current.set(mx * 1.5, my * 1.5)
      headTiltTargetRef.current.set(mx * 0.4, my * 0.4)
    } else {
      // Idle state: eyes slowly lock to center, head tilts back slowly with slight breathing drift
      const lockSpeed = Math.min(1.0, (idleSec - 2) * 0.05) // Gradually lock over time
      
      // Idle drift
      const driftX = Math.sin(t * 0.2) * 0.1 * (1.0 - lockSpeed)
      const driftY = Math.cos(t * 0.15) * 0.1 * (1.0 - lockSpeed)
      
      gazeTargetRef.current.set(driftX, driftY)
      headTiltTargetRef.current.set(driftX * 0.2, driftY * 0.2)
    }

    gazeTargetRef.current.clampLength(0, 1.0)
    gazeRef.current.lerp(gazeTargetRef.current, 0.1)
    headTiltRef.current.lerp(headTiltTargetRef.current, 0.05)

    // ── Section Interpolation ──
    opacityRef.current += (sectionState.opacity - opacityRef.current) * 0.05
    xOffsetRef.current += (sectionState.xOffset - xOffsetRef.current) * 0.03
    
    if (groupRef.current) {
      // Base scale adjustment
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
    <group ref={groupRef} scale={[2.8, 2.8, 2.8]} position={[0, -0.2, 0]}>
      {/* SKULL */}
      <instancedMesh ref={skullMeshRef} args={[undefined, undefined, skullData.count]} frustumCulled={false}>
        <circleGeometry args={[1, 5]}>
          <instancedBufferAttribute attach="attributes-aPos" args={[skullPoints, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[skullData.sizes, 1]} />
          <instancedBufferAttribute attach="attributes-aPulseOffset" args={[skullData.pulse, 1]} />
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

      {/* EYES */}
      <instancedMesh ref={eyeMeshRef} args={[undefined, undefined, eyeData.count]} frustumCulled={false}>
        <circleGeometry args={[1, 6]}>
          <instancedBufferAttribute attach="attributes-aPos" args={[eyePoints, 3]} />
          <instancedBufferAttribute attach="attributes-aSize" args={[eyeData.sizes, 1]} />
          <instancedBufferAttribute attach="attributes-aPulseOffset" args={[eyeData.pulse, 1]} />
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
