import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const banks = getLines(filePath)
  let result = 0

  banks.forEach((bank) => {
    result += getHighestJoltage(bank.split('').map(Number), 2)
  })

  return result
}

export const getPart2 = (filePath) => {
  const banks = getLines(filePath)
  let result = 0

  banks.forEach((bank) => {
    result += getHighestJoltage(bank.split('').map(Number), 12)
  })

  return result
}

const getHighestJoltage = (batteries, count) => {
  const highestJoltage = []
  let i = 0

  for (let x = 0; x < count; x++) {
    let higestDigit = [0, 0]

    while (i < batteries.length + x - (count - 1) && higestDigit[0] < 9) {
      if (batteries[i] > higestDigit[0]) {
        higestDigit = [batteries[i], i]
      }
      i++
    }

    highestJoltage.push(higestDigit[0])
    i = higestDigit[1] + 1
  }

  return +highestJoltage.join('')
}
