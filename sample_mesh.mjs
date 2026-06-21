import fs from 'fs'
import { OBJLoader } from 'three-stdlib'
import { MeshSurfaceSampler } from 'three-stdlib'
import * as THREE from 'three'

const objData = fs.readFileSync('public/face.obj', 'utf-8')
const loader = new OBJLoader()
const object = loader.parse(objData)

let mesh = null
object.traverse((child) => {
  if (child.isMesh) mesh = child
})

if (!mesh) {
  console.error("No mesh found!")
  process.exit(1)
}

// Ensure geometry has normals
mesh.geometry.computeVertexNormals()

const sampler = new MeshSurfaceSampler(mesh).build()
const count = 10000
const positions = new Float32Array(count * 3)

const position = new THREE.Vector3()

for (let i = 0; i < count; i++) {
  sampler.sample(position)
  positions[i * 3] = position.x
  positions[i * 3 + 1] = position.y
  positions[i * 3 + 2] = position.z
}

// Find bounding box to normalize
const box = new THREE.Box3().setFromArray(positions)
const size = new THREE.Vector3()
box.getSize(size)
const center = new THREE.Vector3()
box.getCenter(center)

const maxDim = Math.max(size.x, size.y, size.z)

// Normalize to roughly -1 to 1 range
for (let i = 0; i < count; i++) {
  positions[i * 3] = (positions[i * 3] - center.x) / maxDim * 2.5
  positions[i * 3 + 1] = (positions[i * 3 + 1] - center.y) / maxDim * 2.5
  positions[i * 3 + 2] = (positions[i * 3 + 2] - center.z) / maxDim * 2.5
}

// Convert to formatted string
const parts = []
for (let i = 0; i < positions.length; i++) {
  parts.push(positions[i].toFixed(4))
}

const content = `// Auto-generated 10,000 vertices sampled from WaltHead.obj
export const FACE_VERTICES = new Float32Array([
  ${parts.join(',')}
])
export const PARTICLE_COUNT = 10000;
`

fs.writeFileSync('src/components/3d/faceVertices.ts', content)
console.log("Successfully generated faceVertices.ts with 10,000 points!")
