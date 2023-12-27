import { getLines } from '../../utils/fileStreamUtils.js'

export const getNextExtrapolation = (filePath) => {
  const lines = getLines(filePath)
  let total = 0
  lines.forEach((line) => {
    let values = line.match(/-*\d+/g).map((v) => +v)
    let lastValues = [values[values.length - 1]]
    while (values.some((v) => v !== values[0])) {
      values = values.reduce((p, n, i) => (i > 0 ? [...p, n - values[i - 1]] : []), [])
      lastValues.push(values[values.length - 1])
    }
    const nextValue = lastValues.reverse().reduce((p, n) => p + n, 0)
    total += nextValue
  })
  return total
}

export const getPreviousExtrapolation = (filePath) => {
  const lines = getLines(filePath)
  let total = 0
  lines.forEach((line) => {
    let values = line.match(/-*\d+/g).map((v) => +v)
    let lastValues = [values[0]]
    while (values.some((v) => v !== values[0])) {
      values = values.reduce((p, n, i) => (i > 0 ? [...p, n - values[i - 1]] : []), [])
      lastValues.push(values[0])
    }
    const nextValue = lastValues.reverse().reduce((p, n) => n - p, 0)
    total += nextValue
  })
  return total
}
