import { getLines } from '../../utils/fileStreamUtils.js'

const getNextPipe = (checks) => (part) => {
  const steps = checks.split(',')
  let i = 0
  while (steps[i]) {
    const pipeStep = steps[i]
    if (pipeStep.indexOf(':') === -1) {
      return pipeStep
    }
    const [check, nextPipe] = pipeStep.split(':')
    const value = check.substring(0, 1)
    const operator = check.substring(1, 2)
    const result = +check.substring(2)
    if (operator === '>' && part[value] > result) return nextPipe
    if (operator === '<' && part[value] < result) return nextPipe
    i++
  }
}

const getAcceptedCount = (pipes) => (part) => {
  let nextPipe = pipes['in'](part)
  while (!['R', 'A'].includes(nextPipe)) {
    nextPipe = pipes[nextPipe](part)
  }
  if (nextPipe === 'A') return Object.values(part).reduce((p, n) => p + n, 0)
  return 0
}

const parsePart = (string) =>
  string
    .substring(1, string.length - 1)
    .split(',')
    .reduce((p, n) => {
      const [key, value] = n.split('=')
      p[key] = +value
      return p
    }, {})

export const getSortedParts = (filePath) => {
  const lines = getLines(filePath)
  let i = 0
  let pipes = {}
  while (lines[i] !== '') {
    const [key, checks] = lines[i].split('{')
    pipes[key] = getNextPipe(checks.slice(0, -1))
    i++
  }

  i++
  let acceptedParts = 0
  while (lines[i]) {
    acceptedParts += getAcceptedCount(pipes)(parsePart(lines[i]))
    i++
  }

  return acceptedParts
}

const getNewRangesForCheck = (check, ranges) => {
  const newRanges = Object.assign({}, ranges)
  const restRange = Object.assign({}, ranges)
  const value = check.substring(0, 1)
  const operator = check.substring(1, 2)
  const result = +check.substring(2)
  if (operator === '>') {
    newRanges[value] = [result + 1, ranges[value][1]]
    restRange[value] = [ranges[value][0], result]
  }
  if (operator === '<') {
    newRanges[value] = [ranges[value][0], result - 1]
    restRange[value] = [result, ranges[value][1]]
  }
  return [newRanges, restRange]
}

const getPossibilitiesRec = (checks, key, ranges) => {
  if (key === 'A') {
    return (
      (ranges.x[1] - ranges.x[0] + 1) *
      (ranges.m[1] - ranges.m[0] + 1) *
      (ranges.a[1] - ranges.a[0] + 1) *
      (ranges.s[1] - ranges.s[0] + 1)
    )
  }

  if (key === 'R') {
    return 0
  }

  const split = checks[key].split(',')
  const defaultNextKey = split.pop()
  const notDefault = split.reduce((p, n) => {
    const [test, nextKey] = n.split(':')
    const [newRanges, restRange] = getNewRangesForCheck(test, ranges)
    ranges = restRange
    return p + getPossibilitiesRec(checks, nextKey, newRanges)
  }, 0)

  const defaultPossibilities = getPossibilitiesRec(checks, defaultNextKey, ranges)

  return defaultPossibilities + notDefault
}

export const getSortableParts = (filePath) => {
  const lines = getLines(filePath)
  let i = 0
  let pipes = {}
  while (lines[i] !== '') {
    const [key, checks] = lines[i].split('{')
    pipes[key] = checks.slice(0, -1)
    i++
  }

  return getPossibilitiesRec(pipes, 'in', { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] })
}
