import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0
  let position = 50

  lines.forEach((line) => {
    const [dir, ...rest] = line
    const amount = +rest.join('')
    if (dir === 'L') {
      position = (position - amount + 100) % 100
    }
    if (dir === 'R') {
      position = (position + amount) % 100
    }
    if (position === 0) {
      result++
    }
  })

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0
  let position = 50

  lines.forEach((line) => {
    const [dir, ...rest] = line
    let amount = +rest.join('')

    if (dir === 'L') {
      for (let i = 0; i < amount; i++) {
        position = (position - 1 + 100) % 100
        if (position === 0) {
          result++
        }
      }
    }

    if (dir === 'R') {
      for (let i = 0; i < amount; i++) {
        position = (position + 1) % 100
        if (position === 0) {
          result++
        }
      }
    }
  })

  return result
}
