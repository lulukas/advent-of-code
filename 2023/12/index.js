import { memoize } from '../../utils/utils.js'
import { getLines } from '../../utils/fileStreamUtils.js'

// I could never have done this without Kevin Brechbühlers support and peaking at his code https://github.com/kevinbrechbuehl/advent-of-code/tree/main THX 😘
const getPossibleCombinations = memoize((blocks, pattern) => {
  if (pattern.length === 0) {
    return blocks.length === 0 ? 1 : 0
  }
  if (pattern[0] === '.') {
    return getPossibleCombinations(blocks, pattern.slice(1))
  }
  if (pattern[0] === '?') {
    return (
      getPossibleCombinations(blocks, '.' + pattern.slice(1)) + getPossibleCombinations(blocks, '#' + pattern.slice(1))
    )
  }
  if (pattern[0] === '#') {
    if (blocks.length === 0) {
      return 0
    }
    if (pattern.length < blocks[0]) {
      return 0
    }
    if (pattern.substring(0, blocks[0]).includes('.')) {
      return 0
    }
    if (blocks.length > 1) {
      if (pattern.length < blocks[0] + 1 || pattern.split('')[blocks[0]] === '#') {
        return 0
      }
      return getPossibleCombinations(blocks.slice(1), pattern.slice(blocks[0] + 1))
    } else {
      return getPossibleCombinations(blocks.slice(1), pattern.slice(blocks[0]))
    }
  }
})

export const getTotalPossibilities = (filePath) => {
  const lines = getLines(filePath)
  let totalPossibilities = 0
  lines.forEach((l) => {
    const [pattern, blocks] = l.split(' ')

    const possibleCombinations = getPossibleCombinations(
      blocks.split(',').map((v) => +v),
      pattern
    )

    totalPossibilities += possibleCombinations
  })
  return totalPossibilities
}

export const getTotalPossibilitiesTimesfive = (filePath) => {
  const lines = getLines(filePath)
  let totalPossibilities = 0
  lines.forEach((l) => {
    const [pattern, blocksString] = l.split(' ')
    const blocks = blocksString.split(',').map((v) => +v)
    const blocks5 = [...blocks, ...blocks, ...blocks, ...blocks, ...blocks]
    const pattern5 = pattern + '?' + pattern + '?' + pattern + '?' + pattern + '?' + pattern

    const possibleCombinations = getPossibleCombinations(blocks5, pattern5)
    totalPossibilities += possibleCombinations
  })
  return totalPossibilities
}

//🎉🎊🎄 Wohooo🎄🎊🎉
//Part 1 result: 7307, took 25ms
//Part 2 result: 3415570893842, took 813ms
