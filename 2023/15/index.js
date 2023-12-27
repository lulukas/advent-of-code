import { getLines } from '../../utils/fileStreamUtils.js'

const getHash = (string) => string.split('').reduce((p, n) => ((p + n.charCodeAt(0)) * 17) % 256, 0)

export const getTotalHashes = (filePath) =>
  getLines(filePath)
    .reduce((s, n) => s + n, '')
    .split(',')
    .reduce((ls, ln) => ls + getHash(ln), 0)

export const getFocalPower = (filePath) => {
  const instructions = getLines(filePath)
    .reduce((s, n) => s + n, '')
    .split(',')

  // get Boxes
  const boxes = {}
  for (let i = 0; i < 256; i++) boxes[i] = []

  // fill Boxes
  instructions.forEach((i) => {
    if (i.includes('=')) {
      const [label, focal] = i.split('=')
      const hash = getHash(label)
      const index = boxes[hash].findIndex((a) => a[0] === label)
      if (index > -1) {
        boxes[hash][index] = [label, focal]
      } else {
        boxes[hash].push([label, focal])
      }
    }
    if (i.includes('-')) {
      const [label] = i.split('-')
      const hash = getHash(label)
      const index = boxes[hash].findIndex((a) => a[0] === label)
      index > -1 && boxes[hash].splice(index, 1)
    }
  })

  // calc Power
  const power = Object.values(boxes).reduce(
    (p, n, i) => p + n.reduce((tp, tn, ti) => tp + (i + 1) * (ti + 1) * tn[1], 0),
    0
  )
  return power
}

// Result for Part 1: 505379, took 2ms
// Result for Part 2: 263211, took 3ms
