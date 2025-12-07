import { getLines } from '../../utils/fileStreamUtils.js'
import { memoize } from '../../utils/utils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0

  let beams = new Set([
    lines
      .shift()
      .split('')
      .findIndex((char) => char === 'S'),
  ])

  for (let x = 0; x < lines.length; x++) {
    // console.log('🚀 ~ getPart1 ~ beams:', beams)
    const newBeams = new Set()
    for (let beam of beams) {
      if (lines[x][beam] === '^') {
        newBeams.add(beam - 1)
        newBeams.add(beam + 1)
        result++
      } else {
        newBeams.add(beam)
      }
    }
    beams = newBeams
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  const getBeamCount = memoize((row, col) => {
    if (row >= lines.length) {
      return 1
    }
    if (lines[row][col] === '^') {
      return getBeamCount(row + 1, col - 1) + getBeamCount(row + 1, col + 1)
    } else {
      return getBeamCount(row + 1, col)
    }
  })

  const result = getBeamCount(
    0,
    lines[0].split('').findIndex((char) => char === 'S')
  )

  return result
}
