import { getPossibleWinsShort } from '../../2023/06/index.js'
import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0

  // split lists
  const left = []
  const right = []
  lines.forEach((line) => {
    const [l, r] = line.split('   ')
    left.push(l)
    right.push(r)
  })

  // sort lists
  const leftSorted = left.sort()
  const rightSorted = right.sort()

  // get differences
  let x = 0
  while (x < leftSorted.length) {
    result += Math.abs(rightSorted[x] - leftSorted[x])
    x++
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0

  // split lists
  const left = []
  const right = []
  lines.forEach((line) => {
    const [l, r] = line.split('   ')
    left.push(l)
    right.push(r)
  })

  // get Similarity Scores
  for (let l = 0; l < left.length; l++) {
    let count = 0
    for (let r = 0; r < right.length; r++) {
      if (left[l] === right[r]) count++
    }
    result += count * left[l]
  }

  return result
}
