import { getLines } from '../../utils/fileStreamUtils.js'
import { printFieldArray } from '../../utils/utils.js'

const parseInput = (lines) => {
  const map = []
  let rx = -1
  let ry = -1
  let i = 0
  while (lines[i].length > 0) {
    map.push(lines[i])
    if (rx < 0) {
      rx = lines[i].findIndex((p) => p === '@')
      ry = i
      lines[ry][rx] = '.'
    }
    i++
  }

  i++

  let moves = []
  while (lines[i]) {
    moves = [...moves, ...lines[i]]
    i++
  }

  return { map, rx, ry, moves }
}

const move =
  (map) =>
  ({ rx, ry }, move) => {
    let skip = 1
    switch (move) {
      case '>':
        while (map[ry][rx + skip] === 'O') skip++
        if (map[ry][rx + skip] === '.') {
          map[ry][rx + skip] = 'O'
          map[ry][++rx] = '.'
        }
        break
      case 'v':
        while (map[ry + skip][rx] === 'O') skip++
        if (map[ry + skip][rx] === '.') {
          map[ry + skip][rx] = 'O'
          map[++ry][rx] = '.'
        }
        break
      case '<':
        while (map[ry][rx - skip] === 'O') skip++
        if (map[ry][rx - skip] === '.') {
          map[ry][rx - skip] = 'O'
          map[ry][--rx] = '.'
        }
        break
      case '^':
        while (map[ry - skip][rx] === 'O') skip++
        if (map[ry - skip][rx] === '.') {
          map[ry - skip][rx] = 'O'
          map[--ry][rx] = '.'
        }
        break
    }
    return { rx, ry }
  }

const getGPSCoordinates = (map) => {
  let gps = 0
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === 'O') {
        gps += 100 * y + x
      }
    }
  }
  return gps
}

export const getPart1 = (filePath) => {
  const { map, rx, ry, moves } = parseInput(getLines(filePath).map((l) => l.split('')))
  moves.reduce(move(map), { rx, ry })
  return getGPSCoordinates(map)
}

const expandMap = (map) => {
  const expandedMap = []
  for (let y = 0; y < map.length; y++) {
    expandedMap.push([])
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') {
        expandedMap[y].push('#')
        expandedMap[y].push('#')
      }
      if (map[y][x] === '.') {
        expandedMap[y].push('.')
        expandedMap[y].push('.')
      }
      if (map[y][x] === 'O') {
        expandedMap[y].push('[')
        expandedMap[y].push(']')
      }
    }
  }
  return expandedMap
}

const moveV2 =
  (map) =>
  ({ rx, ry }, move) => {
    let skip = 1
    const boxesToMove = []
    const posToCheck = [`${rx},${ry}`]
    let isBlocked = false
    switch (move) {
      case '>':
        while (map[ry][rx + skip] === '[') skip += 2
        if (map[ry][rx + skip] === '.') {
          while (skip > 1) {
            map[ry][rx + skip] = ']'
            map[ry][rx + (skip - 1)] = '['
            skip -= 2
          }
          map[ry][++rx] = '.'
        }
        break
      case '<':
        while (map[ry][rx - skip] === ']') skip += 2
        if (map[ry][rx - skip] === '.') {
          while (skip > 1) {
            map[ry][rx - skip] = '['
            map[ry][rx - (skip - 1)] = ']'
            skip -= 2
          }
          map[ry][--rx] = '.'
        }
        break
      case 'v':
        while (!isBlocked && posToCheck.length) {
          let [x, y] = posToCheck.shift().split(',').map(Number)
          y++
          if (map[y][x] === '#') {
            isBlocked = true
          } else if (map[y][x] === '[') {
            !boxesToMove.includes(`${x},${y}`) && boxesToMove.push(`${x},${y}`)
            !boxesToMove.includes(`${x + 1},${y}`) && boxesToMove.push(`${x + 1},${y}`)
            !posToCheck.includes(`${x},${y}`) && posToCheck.push(`${x},${y}`)
            !posToCheck.includes(`${x + 1},${y}`) && posToCheck.push(`${x + 1},${y}`)
          } else if (map[y][x] === ']') {
            !boxesToMove.includes(`${x},${y}`) && boxesToMove.push(`${x},${y}`)
            !boxesToMove.includes(`${x - 1},${y}`) && boxesToMove.push(`${x - 1},${y}`)
            !posToCheck.includes(`${x},${y}`) && posToCheck.push(`${x},${y}`)
            !posToCheck.includes(`${x - 1},${y}`) && posToCheck.push(`${x - 1},${y}`)
          }
        }
        if (!isBlocked) {
          while (boxesToMove.length) {
            const [x, y] = boxesToMove.pop().split(',').map(Number)
            map[y + 1][x] = map[y][x]
            map[y][x] = '.'
          }
          ry++
        }
        break
      case '^':
        while (!isBlocked && posToCheck.length) {
          let [x, y] = posToCheck.shift().split(',').map(Number)
          y--
          if (map[y][x] === '#') {
            isBlocked = true
          } else if (map[y][x] === '[') {
            !boxesToMove.includes(`${x},${y}`) && boxesToMove.push(`${x},${y}`)
            !boxesToMove.includes(`${x + 1},${y}`) && boxesToMove.push(`${x + 1},${y}`)
            !posToCheck.includes(`${x},${y}`) && posToCheck.push(`${x},${y}`)
            !posToCheck.includes(`${x + 1},${y}`) && posToCheck.push(`${x + 1},${y}`)
          } else if (map[y][x] === ']') {
            !boxesToMove.includes(`${x},${y}`) && boxesToMove.push(`${x},${y}`)
            !boxesToMove.includes(`${x - 1},${y}`) && boxesToMove.push(`${x - 1},${y}`)
            !posToCheck.includes(`${x},${y}`) && posToCheck.push(`${x},${y}`)
            !posToCheck.includes(`${x - 1},${y}`) && posToCheck.push(`${x - 1},${y}`)
          }
        }
        if (!isBlocked) {
          while (boxesToMove.length) {
            const [x, y] = boxesToMove.pop().split(',').map(Number)
            map[y - 1][x] = map[y][x]
            map[y][x] = '.'
          }
          ry--
        }
        break
    }
    return { rx, ry }
  }

const getGPSCoordinatesV2 = (map) => {
  let gps = 0
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] === '[') {
        gps += 100 * y + x
      }
    }
  }
  return gps
}

export const getPart2 = (filePath) => {
  let { map, rx, ry, moves } = parseInput(getLines(filePath).map((l) => l.split('')))
  map = expandMap(map)
  rx = rx * 2
  moves.reduce(moveV2(map), { rx, ry })
  return getGPSCoordinatesV2(map)
}
