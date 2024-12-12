import { getLines } from '../../utils/fileStreamUtils.js'

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

const isOnMap = (map, x, y) => 0 <= x && x < map[0].length && 0 <= y && y < map.length

const getRegions = (map) => {
  const regions = []
  let count = 0

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] !== '.') {
        const type = map[y][x]
        map[y][x] = '.'
        regions[count] = [`${x},${y}`]
        const queue = [`${x},${y}`]
        while (queue.length) {
          let [nx, ny] = queue.pop().split(',').map(Number)
          DIRS.forEach(([divx, divy]) => {
            const tx = nx + divx
            const ty = ny + divy
            if (isOnMap(map, tx, ty) && map[ty][tx] === type) {
              map[ty][tx] = '.'
              regions[count].push(`${tx},${ty}`)
              queue.push(`${tx},${ty}`)
            }
          })
        }
        count++
      }
    }
  }

  return regions
}

const getPerimeter = (regions) => {
  const perimeter = []

  regions.forEach((region) => {
    const plotPerimeters = region.map(() => 4)
    region.forEach((plot, i) => {
      const [x, y] = plot.split(',').map(Number)
      DIRS.forEach(([divx, divy]) => {
        const plotIndex = region.findIndex((p) => p === `${x + divx},${y + divy}`)
        if (plotPerimeters[i] > 0 && plotIndex > 0 && plotPerimeters[plotIndex] === 4) {
          plotPerimeters[i] -= 2
        }
      })
    })
    perimeter.push(plotPerimeters.reduce((sum, next) => sum + next, 0))
  })

  return perimeter
}

const getSides = (regions) => {
  const sides = []

  regions.forEach((region, i) => {
    sides.push(0)
    region.forEach((plot) => {
      const [x, y] = plot.split(',').map(Number)
      const r = `${x + DIRS[0][0]},${y + DIRS[0][1]}`
      const b = `${x + DIRS[1][0]},${y + DIRS[1][1]}`
      const l = `${x + DIRS[2][0]},${y + DIRS[2][1]}`
      const t = `${x + DIRS[3][0]},${y + DIRS[3][1]}`
      if (!region.includes(t) && !region.includes(r)) sides[i]++
      if (!region.includes(r) && !region.includes(b)) sides[i]++
      if (!region.includes(b) && !region.includes(l)) sides[i]++
      if (!region.includes(l) && !region.includes(t)) sides[i]++
      if (region.includes(t) && region.includes(r) && !region.includes(`${x + 1},${y - 1}`)) sides[i]++
      if (region.includes(r) && region.includes(b) && !region.includes(`${x + 1},${y + 1}`)) sides[i]++
      if (region.includes(b) && region.includes(l) && !region.includes(`${x - 1},${y + 1}`)) sides[i]++
      if (region.includes(l) && region.includes(t) && !region.includes(`${x - 1},${y - 1}`)) sides[i]++
    })
  })

  return sides
}

const sortRegions = (a, b) => {
  const [ax, ay] = a.split(',').map(Number)
  const [bx, by] = b.split(',').map(Number)
  if (ax === bx) {
    return ay < by ? -1 : 1
  }
  return ax < bx ? -1 : 1
}

export const getPart1 = (filePath) => {
  const regions = getRegions(getLines(filePath).map((l) => l.split('')))
  const perimeter = getPerimeter(regions.map((r) => r.sort(sortRegions)))

  return regions.reduce((sum, r, i) => sum + r.length * perimeter[i], 0)
}

export const getPart2 = (filePath) => {
  const regions = getRegions(getLines(filePath).map((l) => l.split('')))
  const sides = getSides(regions)

  return regions.reduce((sum, r, i) => sum + r.length * sides[i], 0)
}
