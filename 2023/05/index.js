import { getLines } from '../../utils/fileStreamUtils.js'

export const getLocation = (filePath) => {
  const lines = getLines(filePath)
  let sourceSet = lines[0].match(/\d+/g).map((v) => +v)
  let destSet = [...sourceSet]

  let lineIndex = 3
  while (lines[lineIndex] !== undefined) {
    if (lines[lineIndex]) {
      const [dest, source, range] = lines[lineIndex].split(' ').map((v) => +v)

      const start = source
      const end = source + (range - 1)
      const diff = dest - source

      sourceSet.forEach((value, i) => {
        if (value >= start && value <= end) {
          destSet[i] = value + diff
        }
      })

      lineIndex++
    } else {
      sourceSet = [...destSet]
      lineIndex += 2
    }
  }
  const lowestLocation = destSet.reduce((lowest, nv) => (lowest > nv ? nv : lowest), Number.MAX_SAFE_INTEGER)
  return lowestLocation
}

export const getLocations = (filePath) => {
  const lines = getLines(filePath)
  const seeds = lines[0].match(/\d+/g).map((v) => +v)

  let sourceSet = []
  let shifts = []
  let destSet = []
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i]
    const end = seeds[i] + (seeds[i + 1] - 1)
    sourceSet.push([start, end])
  }

  sourceSet = sourceSet.sort((a, b) => a[0] - b[0])

  let lineIndex = 3
  while (lines[lineIndex] !== undefined) {
    if (lines[lineIndex]) {
      const [dest, source, range] = lines[lineIndex].split(' ').map((v) => +v)
      const start = source
      const end = source + (range - 1)
      const diff = dest - source
      shifts.push([start, end, diff])
      lineIndex++
    } else {
      destSet = []
      shifts = shifts.sort((a, b) => a[1] - b[1])
      sourceSet.forEach(([rangeStart, rangeEnd]) => {
        const endShift = shifts.find(([start, end]) => rangeStart <= start && start <= rangeEnd && rangeEnd <= end)
        const innShifts = shifts.filter(([start, end]) => rangeStart < start && end < rangeEnd)
        const startShift = shifts.find(([start, end]) => start <= rangeStart && rangeStart <= end && end <= rangeEnd)
        const outShift = shifts.find(([start, end]) => start <= rangeStart && rangeEnd <= end)

        if (outShift) {
          destSet.push(rangeStart + outShift[2])
          destSet.push(rangeEnd + outShift[2])
        } else {
          if (startShift) {
            destSet.push(rangeStart + startShift[2])
            destSet.push(startShift[1] + startShift[2])
            destSet.push(startShift[1] + 1)
          } else {
            destSet.push(rangeStart)
          }

          if (innShifts.length > 0) {
            innShifts.forEach((shift) => {
              destSet.push(shift[0] - 1)
              destSet.push(shift[0] + shift[2])
              destSet.push(shift[1] + shift[2])
              destSet.push(shift[1] + 1)
            })
          }

          if (endShift) {
            destSet.push(endShift[0] - 1)
            destSet.push(endShift[0] + endShift[2])
            destSet.push(rangeEnd + endShift[2])
          } else {
            destSet.push(rangeEnd)
          }
        }
      })
      shifts = []
      sourceSet = []
      for (let i = 0; i < destSet.length; i += 2) {
        sourceSet.push([destSet[i], destSet[i + 1]])
      }
      lineIndex += 2
    }
  }

  return destSet.sort((a, b) => a - b)[0]
}

export const getLocationsSecondSolution = (filePath) => {
  const lines = getLines(filePath)
  const seeds = lines[0].match(/\d+/g).map((v) => +v)

  let sourceSet = []
  let shifts = []
  let destSet = []
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i]
    const end = seeds[i] + (seeds[i + 1] - 1)
    sourceSet.push([start, end])
  }

  sourceSet = sourceSet.sort((a, b) => a[0] - b[0])

  let lineIndex = 3
  while (lines[lineIndex] !== undefined) {
    if (lines[lineIndex]) {
      const [dest, source, range] = lines[lineIndex].split(' ').map((v) => +v)
      const start = source
      const end = source + (range - 1)
      const diff = dest - source
      shifts.push([start, end, diff])
      lineIndex++
    } else {
      destSet = []
      shifts = shifts.sort((a, b) => a[1] - b[1])
      const steps = [
        ...sourceSet.reduce((all, nv) => [...all, ...nv], []),
        ...shifts.reduce((all, nv) => [...all, nv[0], nv[1]], []),
      ].sort((a, b) => a - b)
      let isShift = false
      steps.forEach((step) => {
        if (sourceSet.find(([start, end]) => start <= step && step <= end) !== undefined) {
          const shift = shifts.find(([start, end]) => start <= step && step <= end)
          if (shift) {
            if (sourceSet.find(([start, end]) => start < step && step < end)) {
              if (step == shift[0]) {
                destSet.push(step - 1)
                destSet.push(step + shift[2])
              } else if (step == shift[1]) {
                destSet.push(step + shift[2])
                destSet.push(step + 1)
              }
            } else {
              destSet.push(step + shift[2])
            }
            isShift = !isShift
          } else {
            destSet.push(step)
          }
        }
      })
      shifts = []
      sourceSet = []
      for (let i = 0; i < destSet.length; i += 2) {
        sourceSet.push([destSet[i], destSet[i + 1]])
      }
      lineIndex += 2
    }
  }

  return destSet.sort((a, b) => a - b)[0]
}
