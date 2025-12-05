import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let ranges = []
  let x = 0
  while (lines[x] !== '') {
    const rangeString = lines[x]
    const [min, max] = rangeString.split('-').map(Number)
    ranges.push({ min, max })
    x++
  }
  x++

  let result = 0

  while (x < lines.length) {
    const number = Number(lines[x])
    const inAnyRange = ranges.some(({ min, max }) => number >= min && number <= max)
    if (inAnyRange) {
      result++
    }
    x++
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  let ranges = []
  let x = 0

  while (lines[x] !== '') {
    const rangeString = lines[x]
    const [min, max] = rangeString.split('-').map(Number)
    ranges.push({ min, max })
    x++
  }

  ranges = ranges.sort((a, b) => (a.min - b.min === 0 ? a.max - b.max : a.min - b.min))

  let combinedRanges = []
  let currentRange = ranges.shift()
  while (ranges.length > 0) {
    const nextRange = ranges.shift()
    if (currentRange.max < nextRange.min) {
      combinedRanges.push(currentRange)
      currentRange = nextRange
    } else {
      if (nextRange.max > currentRange.max) {
        currentRange.max = nextRange.max
      }
    }
  }
  combinedRanges.push(currentRange)

  return combinedRanges.reduce((ids, range) => ids + (range.max - range.min + 1), 0)
}
