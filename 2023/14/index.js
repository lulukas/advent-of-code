import { getLines } from '../../utils/fileStreamUtils.js'
import { rotateLeft, rotateRight } from '../../utils/utils.js'

const tiltLeft = (plate) =>
  plate.map((r) =>
    r
      .split('#')
      .map((p) =>
        p
          .split('')
          .sort((a, b) => (a === '.' ? 1 : -1))
          .join('')
      )
      .join('#')
  )

const oneCycle = (plate) => {
  for (let r = 0; r < 4; r++) {
    const rolled = tiltLeft(plate)
    plate = rotateRight(rolled)
  }
  return plate
}

export const getWeightAfterTilt = (filePath) => {
  const lines = getLines(filePath)
  const west = rotateLeft(lines)
  const rolled = tiltLeft(west)
  const south = rotateLeft(rolled)
  const wheight = south.map((r) => r.replace(/[\.\#]/g, '')).reduce((p, n, i) => p + n.length * (i + 1), 0)
  return wheight
}

export const getWeightAfterManyTilt = (filePath) => {
  const lines = getLines(filePath)
  let plate = rotateLeft(lines)
  const cache = new Map()
  let cycleCounter = 0
  let totalCycles = 1000000000
  let hasBeenReduced = false
  while (cycleCounter < totalCycles) {
    const key = JSON.stringify([plate])
    if (!hasBeenReduced && cache.has(key)) {
      const [nextCycleCount, nextPlate] = cache.get(key)
      if (!hasBeenReduced) {
        const diff = cycleCounter - nextCycleCount
        hasBeenReduced = true
        cycleCounter = 0
        totalCycles = (totalCycles - nextCycleCount) % diff
      }
      plate = nextPlate
      cycleCounter++
    } else {
      const nextPlate = oneCycle(plate)
      cache.set(key, [cycleCounter, nextPlate])
      plate = nextPlate
      cycleCounter++
    }
  }

  plate = rotateLeft(plate)
  const wheight = plate.map((r) => r.replace(/[\.\#]/g, '')).reduce((p, n, i) => p + n.length * (i + 1), 0)
  return wheight
}
