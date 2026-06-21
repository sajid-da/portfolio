const fs = require('fs')

const data = fs.readFileSync('public/face.obj', 'utf-8')
const lines = data.split('\n')

let minX = Infinity, maxX = -Infinity
let minY = Infinity, maxY = -Infinity
let minZ = Infinity, maxZ = -Infinity
let count = 0

const vertices = []

for (let line of lines) {
  if (line.startsWith('v ')) {
    const parts = line.split(/\s+/)
    if (parts.length >= 4) {
      const x = parseFloat(parts[1])
      const y = parseFloat(parts[2])
      const z = parseFloat(parts[3])
      vertices.push([x, y, z])
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
      count++
    }
  }
}

console.log(`Vertices: ${count}`)
console.log(`X: ${minX.toFixed(3)} to ${maxX.toFixed(3)}`)
console.log(`Y: ${minY.toFixed(3)} to ${maxY.toFixed(3)}`)
console.log(`Z: ${minZ.toFixed(3)} to ${maxZ.toFixed(3)}`)

// Look for points in the upper half
const upperHalf = vertices.filter(v => v[1] > (minY + maxY) / 2)
console.log(`Vertices in upper half: ${upperHalf.length}`)
