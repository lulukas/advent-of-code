import { getLines } from '../../utils/fileStreamUtils.js'
import { printFieldArray } from '../../utils/utils.js'

const dirs = [
  ['>', '<', 1, 0],
  ['<', '>', -1, 0],
  ['v', '^', 0, 1],
  ['^', 'v', 0, -1],
]

const parseInput = (lines) => {
  const map = []
  let s = ''
  lines.forEach((l, y) => {
    l = l.split('')
    map.push(l)
    const sx = l.findIndex((p) => p === 'S')
    if (sx >= 0) {
      s = { x: sx, y, p: 0, d: '>', t: [`${sx},${y}`] }
    }
  })
  return { map, s }
}

const getPaths = ({ map, s }) => {
  const visited = new Map()
  const paths = []
  const q = [s]
  while (q.length) {
    let { x, y, p, d, t } = q.shift()
    x = +x
    y = +y
    p = +p

    dirs.forEach(([dd, dnot, dx, dy]) => {
      if (d !== dnot) {
        const newX = x + dx
        const newY = y + dy
        const newP = d !== dd ? p + 1001 : p + 1
        if (map[newY][newX] === '.') {
          if (visited.has(`${newX},${newY},${dd}`)) {
            const oldP = visited.get(`${newX},${newY},${dd}`)
            if (newP <= oldP) {
              visited.set(`${newX},${newY},${dd}`, newP)
              q.push({ x: newX, y: newY, p: newP, d: dd, t: [...t, `${newX},${newY}`] })
            }
          } else {
            visited.set(`${newX},${newY},${dd}`, newP)
            q.push({ x: newX, y: newY, p: newP, d: dd, t: [...t, `${newX},${newY}`] })
          }
        } else if (map[newY][newX] === 'E') {
          paths.push({ x: newX, y: newY, p: newP, d: dd, t: [...t, `${newX},${newY}`] })
        }
      }
    })
  }
  return paths
}

const getFastestPath = (paths) => {
  return paths.reduce((fast, n) => (n.p < fast ? n.p : fast), Number.MAX_SAFE_INTEGER)
}

const getBestSeat = ({ map, s }) => {
  let paths = getPaths({ map, s })
  const fastest = getFastestPath(paths)
  paths = paths.filter((p) => p.p === fastest)
  const visited = new Set()
  paths.forEach((path) => {
    if (path.p === fastest) {
      path.t.forEach((t) => {
        visited.add(t)
      })
    }
  })

  visited.values().forEach((v) => {
    const [x, y] = v.split(',').map(Number)
    map[y][x] = 'O'
  })
  printFieldArray('map', map)

  return visited.size
}

export const getPart1 = (filePath) => getFastestPath(getPaths(parseInput(getLines(filePath))))
export const getPart2 = (filePath) => getBestSeat(parseInput(getLines(filePath)))
