import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const rows = getLines(filePath).map((r) => r.split(''))
  let result = 0

  for (let col = 0; col < rows[0].length; col++) {
    for (let row = 0; row < rows.length; row++) {
      if (rows[row][col] !== '@') continue

      const adjacentPaperCount = getAdjacentPaperCount(rows, row, col)
      if (adjacentPaperCount < 4) {
        result++
      }
    }
  }
  return result
}

export const getPart2 = (filePath) => {
  let rows = getLines(filePath).map((r) => r.split(''))
  let result = 0
  let removedInTurn = 0

  do {
    removedInTurn = 0
    const withRemovedRows = [...rows.map((r) => [...r])]

    for (let col = 0; col < rows[0].length; col++) {
      for (let row = 0; row < rows.length; row++) {
        if (rows[row][col] !== '@') continue

        const adjacentPaperCount = getAdjacentPaperCount(rows, row, col)
        if (adjacentPaperCount < 4) {
          withRemovedRows[row][col] = '.'
          removedInTurn++
        }
      }
    }

    rows = withRemovedRows
    result += removedInTurn
  } while (removedInTurn > 0)

  return result
}

const getAdjacentPaperCount = (rows, row, col) => {
  let count = 0
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  directions.forEach(([dRow, dCol]) => {
    const newRow = row + dRow
    const newCol = col + dCol
    if (newRow >= 0 && newRow < rows.length && newCol >= 0 && newCol < rows[0].length) {
      if (rows[newRow][newCol] === '@') {
        count++
      }
    }
  })

  return count
}
