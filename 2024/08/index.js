import { getLines } from '../../utils/fileStreamUtils.js'
import { printFieldArray } from '../../utils/utils.js'

const readAntennas = (lines, width, height) => {
  let antennas = {}
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (lines[y][x] !== '.') {
        const freq = lines[y][x]
        if (antennas[freq]) {
          antennas[freq].push([x, y])
        } else {
          antennas[freq] = [[x, y]]
        }
      }
    }
  }

  return antennas
}

const getAntiNodes = (antennas, width, height) => {
  const antiNodes = new Set()
  Object.values(antennas).forEach((sameFreq) => {
    for (let i = 0; i < sameFreq.length - 1; i++) {
      for (let j = i + 1; j < sameFreq.length; j++) {
        let ax = sameFreq[i][0] + (sameFreq[i][0] - sameFreq[j][0])
        let ay = sameFreq[i][1] + (sameFreq[i][1] - sameFreq[j][1])

        if (ax >= 0 && ax < width && ay >= 0 && ay < height) {
          antiNodes.add(`${ax}|${ay}`)
        }

        ax = sameFreq[j][0] + (sameFreq[j][0] - sameFreq[i][0])
        ay = sameFreq[j][1] + (sameFreq[j][1] - sameFreq[i][1])

        if (ax >= 0 && ax < width && ay >= 0 && ay < height) {
          antiNodes.add(`${ax}|${ay}`)
        }
      }
    }
  })
  return antiNodes
}

const getRepeatingAntiNodes = (antennas, width, height) => {
  const antiNodes = new Set()
  Object.values(antennas).forEach((sameFreq) => {
    for (let i = 0; i < sameFreq.length - 1; i++) {
      for (let j = i + 1; j < sameFreq.length; j++) {
        let ax = sameFreq[i][0]
        let dx = sameFreq[i][0] - sameFreq[j][0]
        let ay = sameFreq[i][1]
        let dy = sameFreq[i][1] - sameFreq[j][1]

        while (ax >= 0 && ax < width && ay >= 0 && ay < height) {
          antiNodes.add(`${ax}|${ay}`)
          ax += dx
          ay += dy
        }

        ax = sameFreq[j][0]
        dx = sameFreq[j][0] - sameFreq[i][0]
        ay = sameFreq[j][1]
        dy = sameFreq[j][1] - sameFreq[i][1]

        while (ax >= 0 && ax < width && ay >= 0 && ay < height) {
          antiNodes.add(`${ax}|${ay}`)
          ax += dx
          ay += dy
        }
      }
    }
  })

  return antiNodes
}

export const getPart1 = (filePath) => {
  const lines = getLines(filePath).map((l) => l.split(''))
  const width = lines[0].length
  const height = lines.length

  const antennas = readAntennas(lines, width, height)
  const antiNodes = getAntiNodes(antennas, width, height)

  return antiNodes.size
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath).map((l) => l.split(''))
  const width = lines[0].length
  const height = lines.length

  const antennas = readAntennas(lines, width, height)
  const antiNodes = getRepeatingAntiNodes(antennas, width, height)

  return antiNodes.size
}
