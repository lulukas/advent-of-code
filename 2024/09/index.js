import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  const line = lines[0].split('').map(Number)
  let l = 0
  let r = line.length - 1

  let id = 0
  let checksum = 0

  while (l <= r) {
    if (l % 2 === 0) {
      for (let i = 0; i < line[l]; i++) {
        checksum += id * (l / 2)
        id++
      }
    } else {
      let n = line[r]
      for (let i = 0; i < line[l]; i++) {
        if (n === 0) {
          r -= 2
          if (l > r) {
            break
          }
          n = line[r]
        }
        checksum += id * (r / 2)
        id++
        n--
      }
      line[r] = n
    }
    l++
  }

  return checksum
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  const line = lines[0].split('').map(Number)
  let l = 0

  let id = 0
  let checksum = 0

  while (l < line.length) {
    if (l % 2 === 0) {
      if (line[l][0] !== '.') {
        for (let i = 0; i < line[l]; i++) {
          checksum += id * (l / 2)
          id++
        }
      } else {
        id += +line[l].toString().slice(1)
      }
      l++
    } else {
      let r = line.length - 1
      if (line[l] > 0) {
        while (l < r && (line[r][0] === '.' || line[r] > line[l])) {
          r -= 2
        }
        if (l < r) {
          for (let i = 0; i < line[r]; i++) {
            checksum += id * (r / 2)
            id++
          }
          line[l] = line[l] - line[r]
          line[r] = '.' + line[r]
        } else {
          id += line[l]
          l++
        }
      } else {
        l++
      }
    }
  }

  return checksum
}
