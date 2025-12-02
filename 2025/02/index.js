import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const ranges = getLines(filePath)[0]
    .split(',')
    .map((range) => {
      const [start, end] = range.split('-')
      return { start, end }
    })
  let result = 0

  ranges.forEach(({ start, end }) => {
    let minLengthOfRepeatingSequence = Math.ceil(start.length / 2)

    if (start.length % 2 !== 0) {
      start = Math.pow(10, start.length) + ''
    }

    let nextInvalidIdSequence = start.slice(0, minLengthOfRepeatingSequence)
    let nextInvalidId = nextInvalidIdSequence + nextInvalidIdSequence
    while (+nextInvalidId <= +end) {
      if (+nextInvalidId >= +start) {
        result += +nextInvalidId
      }
      nextInvalidIdSequence = +nextInvalidIdSequence + 1 + ''
      nextInvalidId = nextInvalidIdSequence + nextInvalidIdSequence
    }
  })

  return result
}

export const getPart2 = (filePath) => {
  const ranges = getLines(filePath)[0]
    .split(',')
    .map((range) => {
      const [start, end] = range.split('-')
      return { start, end }
    })
  let result = 0

  ranges.forEach(({ start, end }) => {
    const invalidIds = []
    for (let repetition = end.length; repetition > 1; repetition--) {
      let minLengthOfRepeatingSequence = Math.ceil(start.length / repetition)
      let tempStart = start
      if (start.length % repetition !== 0) {
        tempStart = Math.pow(10, start.length) + ''
      }

      let nextInvalidIdSequence = tempStart.slice(0, minLengthOfRepeatingSequence)
      let nextInvalidId = nextInvalidIdSequence.repeat(repetition)
      while (+nextInvalidId <= +end) {
        if (+nextInvalidId >= +start && !invalidIds.includes(nextInvalidId)) {
          result += +nextInvalidId
          invalidIds.push(nextInvalidId)
        }
        nextInvalidIdSequence = +nextInvalidIdSequence + 1 + ''
        nextInvalidId = nextInvalidIdSequence.repeat(repetition)
      }
    }
  })

  return result
}
