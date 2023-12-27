import { getLines } from '../../utils/fileStreamUtils.js'

export const getPossibleWinsShort = (filePath) => {
  const lines = getLines(filePath)
  const times = lines[0].match(/\d+/g).map((v) => +v)
  console.log('🚀 ~ file: index.js:6 ~ getPart1 ~ times:', times)
  const distances = lines[1].match(/\d+/g).map((v) => +v)
  console.log('🚀 ~ file: index.js:8 ~ getPart1 ~ distances:', distances)

  let possibleWins = 1

  for (let i = 0; i < times.length; i++) {
    let x = 0
    while (x * (times[i] - x) <= distances[i]) {
      x++
    }
    possibleWins = possibleWins * (times[i] - 2 * x + 1)
  }
  return possibleWins
}

export const getPossibleWinsLong = (filePath) => {
  const lines = getLines(filePath)
  const time = +lines[0].match(/\d+/g).join('').replace(' ', '')
  console.log('🚀 ~ file: index.js:6 ~ getPart1 ~ time:', time)
  const bestDistance = +lines[1].match(/\d+/g).join('').replace(' ', '')
  console.log('🚀 ~ file: index.js:8 ~ getPart1 ~ bestDistance:', bestDistance)

  let possibleWins = 1

  let x = 0
  let distance = 0
  while (distance <= bestDistance) {
    x++
    distance = x * (time - x)
  }

  possibleWins = time - 2 * x + 1

  return possibleWins
}
