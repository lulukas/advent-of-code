import { number } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'
import { printFieldArray } from '../../utils/utils.js'
const mapRobots = (line) => {
  const [p, v] = line.split(' ').map((x) => x.split('=')[1].split(',').map(Number))
  return { px: p[0], py: p[1], vx: v[0], vy: v[1] }
}

const calcNewPos =
  (seconds) =>
  ([mapx, mapy]) =>
  ({ px, py, vx, vy }) => {
    const newx = (px + seconds * vx) % mapx
    const newy = (py + seconds * vy) % mapy
    return { newx: newx < 0 ? mapx + newx : newx, newy: newy < 0 ? mapy + newy : newy }
  }

const getQuadrantCounts =
  ([mapx, mapy]) =>
  (quadrant, { newx, newy }) => {
    const midx = (mapx - 1) / 2
    const midy = (mapy - 1) / 2
    if (newx < midx && newy < midy) quadrant[0]++
    else if (newx > midx && newy > midy) quadrant[1]++
    else if (newx < midx && newy > midy) quadrant[2]++
    else if (newx > midx && newy < midy) quadrant[3]++
    return quadrant
  }

export const getPart1 = (filePath) => {
  const input = getLines(filePath)
  const map = input.shift().split(',').map(Number)
  const robots = input.map(mapRobots)
  const newPos = robots.map(calcNewPos(100)(map))
  const counts = newPos.reduce(getQuadrantCounts(map), [0, 0, 0, 0])

  return counts.reduce((r, nv) => r * nv, 1)
}

export const getPart2 = async (filePath) => {
  const input = getLines(filePath)
  const mapSize = input.shift().split(',').map(Number)
  const robots = input.map(mapRobots)
  let seconds = 18
  const startPos = robots.map(calcNewPos(seconds)(mapSize))
  seconds++
  let newPos = []
  while (seconds < 10000 && JSON.stringify(startPos) !== JSON.stringify(newPos)) {
    newPos = robots.map(calcNewPos(seconds)(mapSize))
    const picture = new Array(mapSize[1]).fill().map(() => new Array(mapSize[0]).fill('.'))
    newPos.forEach(({ newx, newy }) => {
      if (picture[newy][newx] === '.') picture[newy][newx] = 1
      else picture[newy][newx]++
    })
    if (seconds % 101 === 18) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      printFieldArray('seconds: ' + seconds, picture)
    }
    seconds++
  }

  return seconds
}
