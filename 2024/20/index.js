import { getLines } from '../../utils/fileStreamUtils.js'

const parstInput = (map) => {
  let i = 1
  while (true) {
    let si = map[i].findIndex((c) => c === 'S')
    if (si > -1) {
      return { s: `${si},${i}`, map }
    }
    i++
  }
}

const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

const getPath = ({ s, map }) => {
  const path = {}
  path[s] = 0
  const queue = [s]
  let pathLength = 0
  while (queue.length) {
    const [x, y] = queue.shift().split(',').map(Number)
    let i = 0
    while (map[y + dirs[i][1]][x + dirs[i][0]] === '#' || path[`${x + dirs[i][0]},${y + dirs[i][1]}`] !== undefined) {
      i++
    }
    pathLength++
    path[`${x + dirs[i][0]},${y + dirs[i][1]}`] = pathLength
    if (map[y + dirs[i][1]][x + dirs[i][0]] === 'E') {
      return path
    } else {
      queue.push(`${x + dirs[i][0]},${y + dirs[i][1]}`)
    }
  }
  throw 'ooops'
}

const getShortCuts = (skip, minSkip) => (path) => {
  const pathKeys = Object.keys(path)
  let i = 0
  const shortCutsSaves = {}
  while (i < pathKeys.length - 1) {
    for (let j = i + 1; j < pathKeys.length; j++) {
      const [ax, ay] = pathKeys[i].split(',').map(Number)
      const [bx, by] = pathKeys[j].split(',').map(Number)
      const shortcutLength = Math.abs(ax - bx) + Math.abs(ay - by)
      if (shortcutLength <= skip) {
        let dist = Math.abs(path[pathKeys[i]] - path[pathKeys[j]]) - shortcutLength
        if (dist >= minSkip) {
          if (shortCutsSaves[dist] === undefined) {
            shortCutsSaves[dist] = 1
          } else {
            shortCutsSaves[dist]++
          }
        }
      }
    }
    i++
  }
  return shortCutsSaves
}

export const getPart1 = (filePath) => {
  const shortCutsSaves = getShortCuts(2, 100)(getPath(parstInput(getLines(filePath).map((l) => l.split('')))))
  let result = 0
  Object.values(shortCutsSaves).forEach((count) => (result += count))
  return result
}

export const getPart2 = (filePath) => {
  const shortCutsSaves = getShortCuts(20, 100)(getPath(parstInput(getLines(filePath).map((l) => l.split('')))))
  let result = 0
  Object.values(shortCutsSaves).forEach((count) => (result += count))
  return result
}
