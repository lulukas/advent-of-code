import { getLines } from '../../utils/fileStreamUtils.js'
import { memoize } from '../../utils/utils.js'

let towels

const parstInput = (lines) => {
  towels = lines.shift().split(', ')
  lines.shift()
  const patterns = lines
  return patterns
}

const isPatternPossible = memoize((pattern) => {
  if (towels.includes(pattern)) {
    return true
  }
  for (let i = 0; i < towels.length; i++) {
    if (pattern.startsWith(towels[i])) {
      if (isPatternPossible(pattern.substring(towels[i].length))) {
        return true
      }
    }
  }
  return false
})

const getPossiblePatterns = memoize((pattern) => {
  let possiblePatterns = 0
  if (towels.includes(pattern)) {
    possiblePatterns++
  }
  towels.forEach((towel) => {
    if (pattern.startsWith(towel)) {
      if (isPatternPossible(pattern.substring(towel.length))) {
        possiblePatterns += getPossiblePatterns(pattern.substring(towel.length))
      }
    }
  })
  return possiblePatterns
})

export const getPart1 = (filePath) => {
  const patterns = parstInput(getLines(filePath))
  let result = 0

  patterns.forEach((pattern) => {
    if (isPatternPossible(pattern)) {
      result++
    }
  })

  return result
}

export const getPart2 = (filePath) => {
  const patterns = parstInput(getLines(filePath))
  let result = 0

  patterns.forEach((pattern) => {
    result += getPossiblePatterns(pattern)
  })

  return result
}
