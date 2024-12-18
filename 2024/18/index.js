import { forEach } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'

const parseInput = (lines) => {
  const size = +lines.shift()
  const fallen = +lines.shift()
  return { size, fallen, corruptedBytes: lines }
}

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

const notOut = (x, y, size) => x >= 0 && x <= size && y >= 0 && y <= size

const getShortestPathAfter = ({ size, fallen, corruptedBytes }) => {
  const fallenBytes = corruptedBytes.slice(undefined, fallen)
  const visited = new Set()
  let shortestPath = 0

  visited.add(`0,0`)
  let queue = [[0, 0, 1]]
  while (shortestPath === 0 && queue.length) {
    let [x, y, s] = queue.shift()
    dirs.forEach(([dirx, diry]) => {
      let nx = x + dirx
      let ny = y + diry
      if (notOut(nx, ny, size) && !visited.has(`${nx},${ny}`) && !fallenBytes.includes(`${nx},${ny}`)) {
        if (nx === size && ny === size) {
          shortestPath = s
        } else {
          visited.add(`${nx},${ny}`)
          queue.push([nx, ny, s + 1])
        }
      }
    })
    if (shortestPath !== 0) {
      queue = []
    }
  }
  return shortestPath
}

export const getPart1 = (filePath) => getShortestPathAfter(parseInput(getLines(filePath)))

export const getPart2 = (filePath) => {
  let { size, fallen, corruptedBytes } = parseInput(getLines(filePath))
  let result = 1
  while (result > 0) {
    fallen++
    result = getShortestPathAfter({ size, fallen, corruptedBytes })
  }
  // console.log('🚀 ~ getPart2 ~ corruptedBytes:', corruptedBytes, corruptedBytes[fallen - 1])

  return corruptedBytes[fallen - 1]
}
