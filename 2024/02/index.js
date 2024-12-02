import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)

  let result = 0
  lines.forEach((line) => {
    const levels = line.split(' ').map((x) => +x)
    let isSave = levels[0] !== levels[1]

    if (levels[0] < levels[1]) {
      let l = 1
      while (l < levels.length && isSave === true) {
        if (levels[l - 1] >= levels[l] || levels[l] - levels[l - 1] > 3) {
          isSave = false
        }
        l++
      }
    }

    if (levels[0] > levels[1]) {
      let l = 1
      while (l < levels.length && isSave === true) {
        if (levels[l - 1] <= levels[l] || levels[l - 1] - levels[l] > 3) {
          isSave = false
        }
        l++
      }
    }

    if (isSave === true) {
      result++
    }
  })

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  let result = 0

  lines.forEach((line) => {
    const levels = line.split(' ').map((x) => +x)
    let isSave = false
    let drop = 0

    while (drop < levels.length && isSave === false) {
      const shortLevels = levels.filter((l, i) => i !== drop)
      isSave = shortLevels[0] !== shortLevels[1]
      if (shortLevels[0] < shortLevels[1]) {
        let l = 1
        while (l < shortLevels.length && isSave === true) {
          if (shortLevels[l - 1] >= shortLevels[l] || shortLevels[l] - shortLevels[l - 1] > 3) {
            isSave = false
          }
          l++
        }
      }

      if (shortLevels[0] > shortLevels[1]) {
        let l = 1
        while (l < shortLevels.length && isSave === true) {
          if (shortLevels[l - 1] <= shortLevels[l] || shortLevels[l - 1] - shortLevels[l] > 3) {
            isSave = false
          }
          l++
        }
      }
      drop++
    }

    if (isSave === true) {
      result++
    }
  })

  return result
}
