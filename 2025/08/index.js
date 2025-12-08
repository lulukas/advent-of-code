import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const jBoxesPositions = getLines(filePath)
  let connectors = jBoxesPositions.length === 20 ? 10 : 1000
  const distances = jBoxesPositions
    .reduce((dist, box, index) => {
      const [x, y, z] = box.split(',').map(Number)
      for (let i = index + 1; i < jBoxesPositions.length; i++) {
        const [x2, y2, z2] = jBoxesPositions[i].split(',').map(Number)
        const distance = Math.abs(Math.pow(x - x2, 2) + Math.pow(y - y2, 2) + Math.pow(z - z2, 2))
        dist.push({ distance, box1: jBoxesPositions[index], box2: jBoxesPositions[i] })
      }
      return dist
    }, [])
    .sort((a, b) => a.distance - b.distance)

  const circuits = distances
    .splice(0, connectors)
    .reduce((circs, d) => {
      const includesBox1 = circs.findIndex((c) => c.has(d.box1))
      const includesBox2 = circs.findIndex((c) => c.has(d.box2))
      if (includesBox1 === -1 && includesBox2 === -1) {
        circs.push(new Set([d.box1, d.box2]))
      } else if (includesBox1 !== -1 && includesBox2 === -1) {
        circs[includesBox1].add(d.box2)
      } else if (includesBox1 === -1 && includesBox2 !== -1) {
        circs[includesBox2].add(d.box1)
      } else if (includesBox1 !== -1 && includesBox2 !== -1 && includesBox1 !== includesBox2) {
        const combinedSet = new Set([...circs[includesBox1], ...circs[includesBox2]])
        circs = circs.filter((_, index) => index !== includesBox1 && index !== includesBox2)
        circs.push(combinedSet)
      }
      return circs
    }, [])
    .sort((a, b) => b.size - a.size)

  let result = circuits[0].size * circuits[1].size * circuits[2].size

  return result
}

export const getPart2 = (filePath) => {
  const jBoxesPositions = getLines(filePath)
  let connectors = jBoxesPositions.length === 20 ? 10 : 1000
  const distances = jBoxesPositions
    .reduce((dist, box, index) => {
      const [x, y, z] = box.split(',').map(Number)
      for (let i = index + 1; i < jBoxesPositions.length; i++) {
        const [x2, y2, z2] = jBoxesPositions[i].split(',').map(Number)
        const distance = Math.abs(Math.pow(x - x2, 2) + Math.pow(y - y2, 2) + Math.pow(z - z2, 2))
        dist.push({ distance, box1: jBoxesPositions[index], box2: jBoxesPositions[i] })
      }
      return dist
    }, [])
    .sort((a, b) => a.distance - b.distance)

  let circuits = []
  let i = 0
  let d = distances[i]
  circuits.push(new Set([d.box1, d.box2]))
  while (circuits[0].size < jBoxesPositions.length) {
    i++
    let d = distances[i]
    const includesBox1 = circuits.findIndex((c) => c.has(d.box1))
    const includesBox2 = circuits.findIndex((c) => c.has(d.box2))
    if (includesBox1 === -1 && includesBox2 === -1) {
      circuits.push(new Set([d.box1, d.box2]))
    } else if (includesBox1 !== -1 && includesBox2 === -1) {
      circuits[includesBox1].add(d.box2)
    } else if (includesBox1 === -1 && includesBox2 !== -1) {
      circuits[includesBox2].add(d.box1)
    } else if (includesBox1 !== -1 && includesBox2 !== -1 && includesBox1 !== includesBox2) {
      const combinedSet = new Set([...circuits[includesBox1], ...circuits[includesBox2]])
      circuits = circuits.filter((_, index) => index !== includesBox1 && index !== includesBox2)
      circuits.push(combinedSet)
    }
  }

  let result = distances[i].box1.split(',').map(Number)[0] * distances[i].box2.split(',').map(Number)[0]

  return result
}
