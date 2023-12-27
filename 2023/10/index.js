import { getLines } from '../../utils/fileStreamUtils.js'

const startX = 110
const startY = 106
const startDirection = 'up'

export const getFurdest = (filePath) => {
  const lines = getLines(filePath)
  const field = lines.map((l) => l.split(''))
  let steps = 1
  let x = startX
  let y = startY
  let direction = startDirection
  while (field[y][x] !== 'S') {
    switch (field[y][x]) {
      case '-':
        direction === 'right' ? x++ : x--
        break
      case '|':
        direction === 'up' ? y-- : y++
        break
      case 'J':
        if (direction === 'right') {
          y--
          direction = 'up'
        } else {
          x--
          direction = 'left'
        }
        break
      case 'F':
        if (direction === 'up') {
          x++
          direction = 'right'
        } else {
          y++
          direction = 'down'
        }
        break
      case 'L':
        if (direction === 'down') {
          x++
          direction = 'right'
        } else {
          y--
          direction = 'up'
        }
        break
      case '7':
        if (direction === 'right') {
          y++
          direction = 'down'
        } else {
          x--
          direction = 'left'
        }
        break
    }
    steps++
  }
  return steps / 2
}

export const getEnclosed = (filePath) => {
  const lines = getLines(filePath)
  const field = lines.map((l) => l.split(''))
  let x = startX
  let y = startY
  let direction = startDirection
  while (field[y][x] !== 'S') {
    const oldX = x
    const oldY = y
    switch (field[y][x]) {
      case '-':
        direction === 'right' ? x++ : x--
        field[oldY][oldX] = '*'
        break
      case '|':
        direction === 'up' ? y-- : y++
        field[oldY][oldX] = 'I'
        break
      case 'J':
        if (direction === 'right') {
          y--
          direction = 'up'
        } else {
          x--
          direction = 'left'
        }
        field[oldY][oldX] = '^'
        break
      case 'F':
        if (direction === 'up') {
          x++
          direction = 'right'
        } else {
          y++
          direction = 'down'
        }
        field[oldY][oldX] = ','
        break
      case 'L':
        if (direction === 'down') {
          x++
          direction = 'right'
        } else {
          y--
          direction = 'up'
        }
        field[oldY][oldX] = '^'
        break
      case '7':
        if (direction === 'right') {
          y++
          direction = 'down'
        } else {
          x--
          direction = 'left'
        }
        field[oldY][oldX] = ','
        break
    }
  }
  field[y][x] = ','

  console.log(field.map((l) => l.join('')))

  let enclosed = 0

  field.forEach((l) => {
    let pipe = 0
    let possiblyEnclosed = 0
    let up = false
    let down = false
    l.forEach((field) => {
      if (['I', '*', '^', ','].includes(field)) {
        if (possiblyEnclosed > 0) {
          enclosed += possiblyEnclosed
          possiblyEnclosed = 0
        }
        if (field === 'I') {
          pipe++
        } else if (field === ',') {
          if (up) {
            pipe++
            up = !up
          } else {
            down = !down
          }
        } else if (field === '^') {
          if (down) {
            pipe++
            down = !down
          } else {
            up = !up
          }
        }
      } else {
        if (pipe % 2 === 1) {
          possiblyEnclosed++
        }
      }
    })
  })

  return enclosed
}
