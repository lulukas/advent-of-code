import { getLines } from '../../utils/fileStreamUtils.js'

const getHandFromLine = (line) => {
  const [cards, bid] = line.split(' ')
  return {
    cards,
    bid,
  }
}

const getHandWithType = (useJokerRules) => (hand) => {
  const cardCounts = Object.values(
    hand.cards.split('').reduce((counts, card) => {
      if (useJokerRules && card === 'J') return counts
      counts[card] ? counts[card]++ : (counts[card] = 1)
      return counts
    }, {})
  )

  let JokerCount = hand.cards.match(/J/g)?.length || 0

  let type = 0
  if (useJokerRules ? JokerCount === 5 || cardCounts.includes(5 - JokerCount) : cardCounts.includes(5)) {
    type = 6
  } else if (useJokerRules ? cardCounts.includes(4 - JokerCount) : cardCounts.includes(4)) {
    type = 5
  } else if (
    useJokerRules && JokerCount === 1
      ? cardCounts.some((item, index) => item === 2 && cardCounts.indexOf(item) !== index)
      : cardCounts.includes(3) && cardCounts.includes(2)
  ) {
    type = 4
  } else if (useJokerRules ? cardCounts.includes(3 - JokerCount) : cardCounts.includes(3)) {
    type = 3
  } else if (
    useJokerRules && JokerCount > 0
      ? false
      : cardCounts.some((item, index) => item === 2 && cardCounts.indexOf(item) !== index)
  ) {
    type = 2
  } else if (useJokerRules ? cardCounts.includes(2 - JokerCount) : cardCounts.includes(2)) {
    type = 1
  }
  return { ...hand, type }
}

const sortHandFn = (cardValues) => (a, b) => {
  if (a.type !== b.type) {
    return a.type - b.type
  } else {
    let i = 0
    const aCards = a.cards.split('')
    const bCards = b.cards.split('')
    while (aCards[i] === bCards[i]) {
      if (i < 4) i++
      else return 1
    }
    return cardValues[aCards[i]] - cardValues[bCards[i]]
  }
}

const getWinningsFromHands = (total, nextHand, index) => total + nextHand.bid * (index + 1)

export const getTotalWins = (filePath) => {
  const lines = getLines(filePath)
  const cardValuesP1 = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
  }
  return lines
    .map(getHandFromLine)
    .map(getHandWithType(false))
    .sort(sortHandFn(cardValuesP1))
    .reduce(getWinningsFromHands, 0)
}

export const getTotalWinsWithJoker = (filePath) => {
  const lines = getLines(filePath)
  const cardValuesP2 = {
    A: 13,
    K: 12,
    Q: 11,
    J: 0,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
  }
  return lines
    .map(getHandFromLine)
    .map(getHandWithType(true))
    .sort(sortHandFn(cardValuesP2))
    .reduce(getWinningsFromHands, 0)
}
