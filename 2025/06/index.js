import { re } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath).map((line) => line.match(/\d+|\+|\*/g))

  let result = 0

  for (let x = 0; x < lines[0].length; x++) {
    let solution = +lines[0][x]
    const operator = lines[lines.length - 1][x]

    for (let y = 1; y < lines.length - 1; y++) {
      const number = lines[y][x]
      if (operator === '+') {
        solution = solution + +number
      } else if (operator === '*') {
        solution = solution * +number
      }
    }

    result += solution
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath).map((line) => line.split(''))
  let result = 0
  let numbers = []
  for (let x = lines[0].length - 1; x >= 0; x--) {
    let operator = lines[lines.length - 1][x]
    let number = ''
    for (let y = 0; y < lines.length - 1; y++) {
      number += lines[y][x]
    }
    numbers.push(+number)

    if (operator === '+' || operator === '*') {
      let solution = numbers.reduce(
        (acc, curr) => {
          if (operator === '+') {
            return acc + curr
          } else if (operator === '*') {
            return acc * curr
          }
        },
        operator === '+' ? 0 : 1
      )
      result += solution
      numbers = []
      x--
    }
  }

  return result
}
