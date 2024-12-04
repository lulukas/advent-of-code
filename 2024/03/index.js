import { getLines } from '../../utils/fileStreamUtils.js'

let take = true

const func_mul = (a, b) => a * b

const func_do = () => {
  take = true
  return 0
}
const func_dont = () => {
  take = false
  return 0
}

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)

  let hugestring = ''
  lines.forEach((line) => (hugestring = hugestring + line))

  const mults = hugestring.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)/gm)

  let result = 0
  mults.forEach((line) => {
    result += eval('func_' + line[0])
  })

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  let hugestring = ''
  lines.forEach((line) => (hugestring = hugestring + line))

  const mults = hugestring.matchAll(/mul\([0-9]{1,3},[0-9]{1,3}\)|do\(\)|don't\(\)/gm)

  let result = 0
  mults.forEach((line) => {
    const mult = eval(('func_' + line[0]).replace("'", ''))
    if (take) {
      result += mult
    }
  })

  return result
}
