import { getLines } from '../../utils/fileStreamUtils.js'

/*
0 = oben
1 = rechts
2 = unten
3 = links
*/
export const getLongestHikeIcy = (filePath) => {
  const land = getLines(filePath).map((l) => l.split(''))

  // x, y, steps, visited
  const paths = [[1, 0, 0, ['1,-1']]]

  // steps
  const hikes = [0]

  while (paths.length > 0) {
    const [x, y, steps, visited] = paths.pop()
    if (!visited.includes(`${x},${y}`)) {
      if (y >= land.length) {
        hikes.push(steps)
      } else if (land[y][x] === '^') {
        paths.push([x, y - 1, steps + 1, [...visited, `${x},${y}`]])
      } else if (land[y][x] === '>') {
        paths.push([x + 1, y, steps + 1, [...visited, `${x},${y}`]])
      } else if (land[y][x] === 'v') {
        paths.push([x, y + 1, steps + 1, [...visited, `${x},${y}`]])
      } else if (land[y][x] === '<') {
        paths.push([x - 1, y, steps + 1, [...visited, `${x},${y}`]])
      } else if (land[y][x] === '.') {
        paths.push([x, y - 1, steps + 1, [...visited, `${x},${y}`]])
        paths.push([x + 1, y, steps + 1, [...visited, `${x},${y}`]])
        paths.push([x - 1, y, steps + 1, [...visited, `${x},${y}`]])
        paths.push([x, y + 1, steps + 1, [...visited, `${x},${y}`]])
      }
    }
  }

  return Math.max(...hikes)
}

export const getLongestHike = (filePath) => {
  const land = getLines(filePath).map((l) => l.split(''))

  // x, y, steps, visited
  const nodes = [[1, 1, 1, '1,0', ['1,0']]]

  // steps
  let longestHike = 0

  let junctions = {}

  // find Weighted Nodes
  while (nodes.length > 0) {
    let [x, y, steps, lastNode, visited] = nodes.shift()
    let nextNodes = []
    while (nextNodes.length < 2 && y < land.length - 1 && y > 0) {
      visited.push(`${x},${y}`)
      nextNodes = [
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
        [x, y - 1],
      ].filter((next) => {
        return !visited.includes(`${next[0]},${next[1]}`) && land[next[1]][next[0]] !== '#'
      })
      if (nextNodes.length === 1) {
        x = nextNodes[0][0]
        y = nextNodes[0][1]
        steps++
      }
    }
    if (!(lastNode in junctions)) {
      junctions[lastNode] = {}
    }
    junctions[lastNode][`${x},${y}`] = steps

    if (nextNodes.length > 1 && !(`${x},${y}` in junctions)) {
      nextNodes.forEach((n) => {
        nodes.push([n[0], n[1], 1, `${x},${y}`, [`${x},${y}`]])
      })
    }
  }

  let paths = [['1,0', 0, ['1,0']]]

  while (paths.length > 0) {
    let [node, steps, visited] = paths.sort((a, b) => b[1] - a[1]).shift()
    if (node === `${land.length - 2},${land.length - 1}`) {
      if (longestHike < steps) {
        longestHike = steps
      }
    } else {
      for (let nextNode in junctions[node]) {
        if (!visited.includes(nextNode)) {
          const nextSteps = steps + junctions[node][nextNode]
          paths.push([nextNode, nextSteps, [...visited, node]])
        }
      }
    }
  }

  return longestHike
}
