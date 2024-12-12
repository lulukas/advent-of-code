import { getLines } from '../../utils/fileStreamUtils.js'

// THX Kevin
const blink = (stones) =>
  stones.reduce((s, ns) => {
    const [value, count] = ns.split(',')
    if (+value === 0) {
      s.push(`1,${count}`)
    } else if (value.length % 2 === 0) {
      s.push(`${value.substring(0, value.length / 2)},${count}`)
      s.push(`${(+value.substring(value.length / 2)).toString()},${count}`)
    } else {
      s.push(`${(+value * 2024).toString()},${count}`)
    }
    return s
  }, [])

const combineStones = (stones, ns) => {
  const i = stones.findIndex((s) => s.split(',')[0] === ns.split(',')[0])
  if (i > -1) {
    const [stone, count] = stones[i].split(',')
    const [_, nCount] = ns.split(',')
    stones[i] = `${stone},${+count + +nCount}`
  } else {
    stones.push(ns)
  }
  return stones
}

export const getPart1 = (filePath) => {
  let stones = getLines(filePath)[0]
    .split(' ')
    .map((s) => `${s},1`)
    .reduce(combineStones, [])

  let blinks = 25

  while (blinks > 0) {
    stones = blink(stones).reduce(combineStones, [])
    blinks--
  }

  let result = 0
  stones.forEach((s) => (result += +s.split(',')[1]))
  return result
}

export const getPart2 = (filePath) => {
  let stones = getLines(filePath)[0]
    .split(' ')
    .map((s) => `${s},1`)
    .reduce(combineStones, [])

  let blinks = 75

  while (blinks > 0) {
    stones = blink(stones).reduce(combineStones, [])
    blinks--
  }

  let result = 0
  stones.forEach((s) => (result += +s.split(',')[1]))
  return result
}
