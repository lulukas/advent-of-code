import { getLines } from '../../utils/fileStreamUtils.js'

const getMatchCountFromLine = (line) => {
  const [_, numbers] = line.split(':')
  const [winning, mine] = numbers.split('|')
  const winningNrs = winning.replace(/  +/g, ' ').trim().split(' ')
  const myNrs = mine.replace(/  +/g, ' ').trim().split(' ')
  return myNrs.reduce((matches, nextNr) => (winningNrs.includes(nextNr) ? matches + 1 : matches), 0)
}

export const getTotalScratchcardPoints = (filePath) => {
  let totalScratchcardPoints = 0
  const lines = getLines(filePath)
  lines.forEach((line) => {
    const matchCount = getMatchCountFromLine(line)
    totalScratchcardPoints += matchCount > 0 ? Math.pow(2, matchCount - 1) : 0
  })
  return totalScratchcardPoints
}

export const getTotalScratchcardCount = (filePath) => {
  const lines = getLines(filePath)
  const cardCount = []
  lines.forEach((line, index) => {
    cardCount[index] = cardCount[index] ? cardCount[index] + 1 : 1
    const matchCount = getMatchCountFromLine(line)
    for (let i = 1; i < matchCount + 1; i++) {
      cardCount[index + i] = cardCount[index + i] ? cardCount[index + i] + cardCount[index] : cardCount[index]
    }
  })

  return cardCount.reduce((total, copies) => total + copies, 0)
}
