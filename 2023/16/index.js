import { getLines } from '../../utils/fileStreamUtils.js'

// directions
// 0 > right
// 1 v down
// 2 < left
// 3 ^ up

const getNextLaserHeads = (x, y, dir, field) => {
  switch (field[y][x]) {
    case '.':
      switch (dir) {
        case 0:
          return [[x + 1, y, dir]]
        case 1:
          return [[x, y + 1, dir]]
        case 2:
          return [[x - 1, y, dir]]
        case 3:
          return [[x, y - 1, dir]]
      }
    case '/':
      switch (dir) {
        case 0:
          return [[x, y - 1, 3]]
        case 1:
          return [[x - 1, y, 2]]
        case 2:
          return [[x, y + 1, 1]]
        case 3:
          return [[x + 1, y, 0]]
      }
    case '\\':
      switch (dir) {
        case 0:
          return [[x, y + 1, 1]]
        case 1:
          return [[x + 1, y, 0]]
        case 2:
          return [[x, y - 1, 3]]
        case 3:
          return [[x - 1, y, 2]]
      }
    case '-':
      switch (dir) {
        case 0:
          return [[x + 1, y, dir]]
        case 2:
          return [[x - 1, y, dir]]
        case 1:
        case 3:
          return [
            [x + 1, y, 0],
            [x - 1, y, 2],
          ]
      }
    case '|':
      switch (dir) {
        case 0:
        case 2:
          return [
            [x, y + 1, 1],
            [x, y - 1, 3],
          ]
        case 1:
          return [[x, y + 1, dir]]
        case 3:
          return [[x, y - 1, dir]]
      }
  }
}

const getEnergizedFields = (xin, yin, dirIn, field) => {
  const visited = {}
  const laserhead = [[xin, yin, dirIn]]

  while (laserhead.length > 0) {
    const [x, y, dir] = laserhead.pop()

    if (`${x},${y}` in visited && visited[`${x},${y}`].some((d) => d === dir)) {
    } else {
      const xInBound = 0 <= x && x < field[0].length
      const yInBound = 0 <= y && y < field.length

      if (xInBound && yInBound) {
        if (`${x},${y}` in visited) visited[`${x},${y}`].push(dir)
        else visited[`${x},${y}`] = [dir]
        laserhead.push(...getNextLaserHeads(x, y, dir, field))
      } else {
      }
    }
  }

  return Object.keys(visited).length
}

export const getEnergizingPath = (filePath) => {
  const field = getLines(filePath).map((l) => l.split(''))

  return getEnergizedFields(0, 0, 0, field)
}

export const getBestEnergizingPath = (filePath) => {
  const field = getLines(filePath).map((l) => l.split(''))
  let mostEnergized = 0
  let energie = 0
  for (let i = 0; i < field.length; i++) {
    energie = getEnergizedFields(0, i, 0, field)
    mostEnergized = energie > mostEnergized ? energie : mostEnergized
    energie = getEnergizedFields(field[0].length - 1, i, 2, field)
    mostEnergized = energie > mostEnergized ? energie : mostEnergized
  }
  for (let i = 0; i < field[0].length; i++) {
    energie = getEnergizedFields(i, 0, 1, field)
    mostEnergized = energie > mostEnergized ? energie : mostEnergized
    energie = getEnergizedFields(i, field.length - 1, 3, field)
    mostEnergized = energie > mostEnergized ? energie : mostEnergized
  }

  console.log()

  return mostEnergized
}
