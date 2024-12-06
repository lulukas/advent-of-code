import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  let lines = getLines(filePath).map((line) => line.split(''))

  const directions = ['^', '>', 'v', '<']

  let guardY = -1
  let guardX = -1
  while (guardX === -1) {
    guardY++
    guardX = lines[guardY].findIndex((char) => directions.includes(char))
  }

  let guardsDir = directions.findIndex((dir) => dir === lines[guardY][guardX])

  const moves = [
    () => {
      if (guardY - 1 >= 0) {
        // console.log('🚀 ~ up', guardX, guardY)
        if (lines[guardY - 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardY--
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardX + 1 < lines[0].length) {
        // console.log('🚀 ~ right:', guardX, guardY)
        if (lines[guardY][guardX + 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardX++
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardY + 1 < lines.length) {
        // console.log('🚀 ~ down', guardX, guardY)
        if (lines[guardY + 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardY++
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardX - 1 >= 0) {
        // console.log('🚀 ~ left:', guardX, guardY)
        if (lines[guardY][guardX - 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardX--
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
  ]

  while (moves[guardsDir]()) {}

  // printFieldArray('test', lines)

  let result = 0

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === 'X') {
        result++
      }
    }
  }

  return result
}

export const getPart2 = (filePath) => {
  let lines = getLines(filePath).map((line) => line.split(''))

  const directions = ['^', '>', 'v', '<']

  let guardY = -1
  let guardX = -1
  while (guardX === -1) {
    guardY++
    guardX = lines[guardY].findIndex((char) => directions.includes(char))
  }
  let guardsDir = directions.findIndex((dir) => dir === lines[guardY][guardX])

  let originalGuardPos = [guardX, guardY, guardsDir]

  const markPath = [
    () => {
      if (guardY - 1 >= 0) {
        if (lines[guardY - 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardY--
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardX + 1 < lines[0].length) {
        if (lines[guardY][guardX + 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardX++
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardY + 1 < lines.length) {
        if (lines[guardY + 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardY++
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
    () => {
      if (guardX - 1 >= 0) {
        if (lines[guardY][guardX - 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        lines[guardY][guardX] = 'X'
        guardX--
        return true
      } else {
        lines[guardY][guardX] = 'X'
        return false
      }
    },
  ]

  while (markPath[guardsDir](true)) {}

  let path = []
  let isLoop = false
  const move = [
    () => {
      if (guardY - 1 >= 0) {
        if (lines[guardY - 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        if (path.includes(`${guardX}|${guardY}|${guardsDir}`)) {
          isLoop = true
          return false
        }
        path.push(`${guardX}|${guardY}|${guardsDir}`)
        guardY--
        return true
      } else {
        return false
      }
    },
    () => {
      if (guardX + 1 < lines[0].length) {
        if (lines[guardY][guardX + 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        if (path.includes(`${guardX}|${guardY}|${guardsDir}`)) {
          isLoop = true
          return false
        }
        path.push(`${guardX}|${guardY}|${guardsDir}`)
        guardX++
        return true
      } else {
        return false
      }
    },
    () => {
      if (guardY + 1 < lines.length) {
        if (lines[guardY + 1][guardX] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        if (path.includes(`${guardX}|${guardY}|${guardsDir}`)) {
          isLoop = true
          return false
        }
        path.push(`${guardX}|${guardY}|${guardsDir}`)
        guardY++
        return true
      } else {
        return false
      }
    },
    () => {
      if (guardX - 1 >= 0) {
        if (lines[guardY][guardX - 1] === '#') {
          guardsDir = (guardsDir + 1) % 4
          return true
        }
        if (path.includes(`${guardX}|${guardY}|${guardsDir}`)) {
          isLoop = true
          return false
        }
        path.push(`${guardX}|${guardY}|${guardsDir}`)
        guardX--
        return true
      } else {
        return false
      }
    },
  ]

  let result = 0

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === 'X' && !(x === originalGuardPos[0] && y === originalGuardPos[1])) {
        ;[guardX, guardY, guardsDir] = originalGuardPos
        lines[y][x] = '#'
        path = []
        isLoop = false
        while (move[guardsDir](true)) {}

        if (isLoop) {
          result++
        }
        lines[y][x] = 'X'
      }
    }
  }

  return result
}
