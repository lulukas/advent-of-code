import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)

  const width = lines[0].length
  const height = lines.length

  let result = 0

  const word = 'XMAS'

  const directions = [
    (x, y, p) => x + p < width && lines[y][x + p] === word[p], // right
    (x, y, p) => x - p > -1 && lines[y][x - p] === word[p], // left
    (x, y, p) => y + p < height && lines[y + p][x] === word[p], // down
    (x, y, p) => y - p > -1 && lines[y - p][x] === word[p], // up
    (x, y, p) => x + p < width && y + p < height && lines[y + p][x + p] === word[p], // down right
    (x, y, p) => x - p > -1 && y - p > -1 && lines[y - p][x - p] === word[p], // up left
    (x, y, p) => x - p > -1 && y + p < height && lines[y + p][x - p] === word[p], // down left
    (x, y, p) => x + p < width && y - p > -1 && lines[y - p][x + p] === word[p], // up right
  ]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (lines[y][x] === word[0]) {
        for (let d = 0; d < directions.length; d++) {
          let p = 0
          while (directions[d](x, y, p)) {
            p++
          }
          if (p === word.length) {
            result++
          }
        }
      }
    }
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  const width = lines[0].length
  const height = lines.length

  let result = 0

  const directions = [
    (x, y) =>
      lines[y - 1][x - 1] === 'M' &&
      lines[y - 1][x + 1] === 'S' &&
      lines[y + 1][x + 1] === 'S' &&
      lines[y + 1][x - 1] === 'M',
    (x, y) =>
      lines[y - 1][x - 1] === 'M' &&
      lines[y - 1][x + 1] === 'M' &&
      lines[y + 1][x + 1] === 'S' &&
      lines[y + 1][x - 1] === 'S',
    (x, y) =>
      lines[y - 1][x - 1] === 'S' &&
      lines[y - 1][x + 1] === 'M' &&
      lines[y + 1][x + 1] === 'M' &&
      lines[y + 1][x - 1] === 'S',
    (x, y) =>
      lines[y - 1][x - 1] === 'S' &&
      lines[y - 1][x + 1] === 'S' &&
      lines[y + 1][x + 1] === 'M' &&
      lines[y + 1][x - 1] === 'M',
  ]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (lines[y][x] === 'A') {
        for (let d = 0; d < directions.length; d++) {
          if (directions[d](x, y)) {
            result++
          }
        }
      }
    }
  }

  return result
}
